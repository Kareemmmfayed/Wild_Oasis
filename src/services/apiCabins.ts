import supabase, { supabaseUrl } from "./supabase";
import { FieldValues } from "react-hook-form";

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.log(error);
    throw new Error("Cabins couldn't be loaded");
  }

  return data;
}

export async function deleteCabin(id: number) {
  const { error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.log(error);
    throw new Error("Cabin couldn't be deleted");
  }
}

export async function createEditCabin(newCabin: FieldValues, id?: number) {
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

  const imageName = `${Math.random()}-${newCabin.image.name}`.replace("/", "");

  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = supabase.from("cabins");

  // For creation
  if (!id) {
    query = query
      .insert([{ ...newCabin, image: imagePath }])
      .select()
      .single();
  }

  // For Editing
  if (id) {
    query = query.update({ ...newCabin, image: imagePath }).eq("id", id);
  }

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error("Cabin couldn't be created");
  }

  // Upload file

  if (imagePath) return;

  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  if (storageError) {
    await supabase.from("cabins").delete().eq("id", newCabin.id);
    throw new Error("Cabin couldn't be created!");
  }

  return data;
}
