import supabase from "./supabase";
import { FieldValues } from "react-hook-form";

export async function getCabins() {
  const { data, error } = await supabase.from("cabins").select("*");

  if (error) {
    console.log(error);
    throw new Error("Cabins couldn't be loaded");
  }

  return data;
}

export async function deleteCabin(id: string) {
  const { error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.log(error);
    throw new Error("Cabin couldn't be deleted");
  }
}

export async function createCabin(newCabin: FieldValues) {
  const { error } = await supabase.from("cabins").insert(newCabin).select();

  if (error) {
    console.error(error);
    throw new Error("Cabin couldn't be created");
  }
}
