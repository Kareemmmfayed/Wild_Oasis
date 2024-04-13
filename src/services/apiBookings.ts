import { PAGE_SIZE } from "../utils/constants";
import { getToday } from "../utils/helpers";
import supabase from "./supabase";

export async function getBookings({
  filter,
  sortBy,
  page,
}: {
  filter?: { field: string; value: string; method: string } | null;
  sortBy?: { field: string; direction: string } | null;
  page?: number;
}) {
  try {
    let query = supabase
      .from("bookings")
      .select(
        "id,createdAt,startDate,endDate,numNights,numGuests,status,totalPrice, cabins(name), guests(fullName,email)",
        { count: "exact" }
      );

    // FILTER
    if (filter) query = query.eq(filter!.field, filter!.value);

    // SORT
    if (sortBy)
      query = query.order(sortBy.field, {
        ascending: sortBy.direction === "asc",
      });

    // PAGINATION
    if (page) {
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      query = query.range(from, to);
    }
    const { data, error, count } = await query;

    if (error) {
      throw new Error("Bookings couldn't be loaded");
    }
    return { data, count };
  } catch (err) {
    console.error(err);
  }
}

export async function getBooking(id: number) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, cabins(*), guests(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking not found");
  }

  return data;
}

export async function getBookingsAfterDate(date: Date | string) {
  const { data, error } = await supabase
    .from("bookings")
    .select("createdAt, totalPrice, extrasPrice")
    .gte("createdAt", date)
    .lte("createdAt", getToday({ end: true }));

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

// Returns all STAYS that are were created after the given date
export async function getStaysAfterDate(date: Date | string) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName)")
    .gte("startDate", date)
    .lte("startDate", getToday());

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }

  return data;
}

export async function getStaysTodayActivity() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*, guests(fullName, nationality, countryFlag)")
    .or(
      `and(status.eq.unconfirmed,startDate.eq.${getToday()}),and(status.eq.checked-in,endDate.eq.${getToday()})`
    )
    .order("createdAt");

  if (error) {
    console.error(error);
    throw new Error("Bookings could not get loaded");
  }
  return data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateBooking(id: number, obj: any) {
  const { data, error } = await supabase
    .from("bookings")
    .update(obj)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }
  return data;
}

export async function deleteBooking(id: number) {
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }
  return data;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createBooking(newBooking: any) {
  const { data, error } = await supabase
    .from("bookings")
    .insert([{ ...newBooking }])
    .select();

  if (error) throw new Error(error.message);

  return data;
}
