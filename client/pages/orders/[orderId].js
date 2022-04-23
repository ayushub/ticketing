import { useEffect, useState } from "react";
import useRequest from "../../hooks/use-request";
import StripeCheckout from "react-stripe-checkout";

const OrderShow = ({ order, user }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => console.log(payment),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div>
      Time left to pay: {timeLeft} seconds
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51KrKCsHJHm0KTh4WLcF35wknertiFIRW70RxGCMIrNAv7XPwJhRseAcQDpOhHpbTVGGjnUDde0XA4R6izgTNDJx900AxvYW9fK"
        amount={order.ticket.price * 100}
        email={user.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client, user) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data, user };
};

export default OrderShow;
