import BookingRow from "./BookingRow";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Empty from "../../ui/Empty";
import { useBookings } from "./useBookings";
import Spinner from "../../ui/Spinner";
import Pagination from "../../ui/Pagination";
import AddBooking from "./AddBooking";

export type Booking = {
  id: number;
  createdAt: string;
  startDate: string;
  endDate: string;
  numNights: number;
  numGuests: number;
  totalPrice: number;
  status: string;
  guests: { fullName: string; email: string };
  cabins: { name: string };
};

function BookingTable() {
  const { bookings, isLoading, count } = useBookings();

  if (isLoading) return <Spinner />;

  if (!bookings!.length) return <Empty resourceName="bookings" />;

  return (
    <Menus>
      <Table columns="0.6fr 2fr 2.4fr 1.4fr 1fr 3.2rem">
        <Table.Header>
          <div>Cabin</div>
          <div>Guest</div>
          <div>Dates</div>
          <div>Status</div>
          <div>Amount</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={bookings as never}
          render={(booking) => (
            <BookingRow key={booking.id} booking={booking as Booking} />
          )}
        />
        <Table.Footer>
          <Pagination count={count!} />
        </Table.Footer>
      </Table>
      <AddBooking />
    </Menus>
  );
}

export default BookingTable;
