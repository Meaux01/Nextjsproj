import { useState } from "react";
import Head from 'next/head';
import Link from "next/link";
import {useStripe, useELements, CardElement} from '@stripe/react-stripe-js';
import axios from "axios";
import { siteTitle } from "../components/layouts";

export const getServerSideProps = async () => {
    const {NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY} = process.env
    return{
        props:{
            stripePubKey: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
        }
    }
}
const billingForm = () => {
// Billing information fields and their initial values
const [billingDetails, setBillingDetails] = useState({
    name:'',
    email: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
});

// Payment Information Fields and their initial values
const [paymentDetails, setPaymentDetails] = useState({
    cardHolderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
        cvc: '',
    })
    
const [loading, setLoading] = useState(false);
const [success, setSuccess] = useState(false);
const [error, setError] = useState(null);
const stripe = useStripe();
const elements = useELements();

    // Handle changes in billing information fields
    function handleBillingDetailsChange(event){
        const { name, value} = event.target;
        setBillingDetails((prev)=>({...prev, [name]:value}))
    }
    
    
    // Handle changes in payment information fields
    function handlePaymentDetailsChange(event){
        const { name, value} = event.target;
        setPaymentDetails((prev)=>({...prev, [name]:value}))
    }
    
    
    
    async function handlePaymentSubmit(event){
        event.preventDefault();
        setLoading(true);
        
        const {paymentMethod, error: stripeError} = await stripe.createPaymentMethod({
            type:'card',
            card: elements.getElement(CardElement),
            // billing_details:billingDetails,
        })
        
        if(stripeError){
            setLoading(false);
            setError(stripeError.message);
            return
        }
        const { id } = paymentMethod
        
    
            // Send the payment method ID to your server to complete the payment
            
            const response = await axios.post('/api/charge',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body :JSON.stringify({
                id,
                billingDetails,
                paymentDetails})
            })

            const {status} = await response.json();

        if (status === 'succeeded'){
            setSuccess(false);
            setError('');
            setBillingDetails({
                name:'',
                email: '',
                address: '',
                city: '',
                state: '',
                postalCode: '',
                country: '',
            });
            setPaymentDetails({
                cardHolderName: '',
                cardNumber: '',
                expiryMonth: '',
                expiryYear: '',
                    cvc: '',
            })
        }else{
            setLoading(false)
            setError('Payment Failed! Please Try Again.')
        }
        
    }
return(<>
    <Head>
        <title>{siteTitle}</title>
    </Head>
    <h1>Billing Information</h1>
    {success ? (
        <>
        <p>Payment Successful</p>
        <Link href='/'>
            Home
        </Link>
        </>

) : (
    <form onSubmit={handlePaymentSubmit}>
            <h2>Billing Details</h2>
            <div>
                <label htmlFor="name">Name</label>
                <input
                id="name"
                type='text'
                name="name"
                value={billingDetails.name}
                onchange={handleBillingDetailsChange}
                />
            </div>
            <div>
            <label htmlFor="email">Email</label>
                <input
                id="email"
                type='text'
                name="email"
                value={billingDetails.email}
                onchange={handleBillingDetailsChange}
                />
            </div>
            <div>
            <label htmlFor="address">Address</label>
                <input
                id="address"
                type='text'
                name="address"
                value={billingDetails.address}
                onchange={handleBillingDetailsChange}
                />
            </div>
            <div>
            <label htmlFor="city">City</label>
                <input
                id="city"
                type='text'
                name="city"
                value={billingDetails.city}
                onchange={handleBillingDetailsChange}
                />
            </div>
            <div>
            <label htmlFor="state">State</label>
                <input
                id="state"
                type='text'
                name="state"
                value={billingDetails.state}
                onchange={handleBillingDetailsChange}
                />
            </div>
            <div>
            <label htmlFor="postalCode">Postal Code</label>
                <input
                id="postalCode"
                type='text'
                name="postalCode"
                value={billingDetails.postalCode}
                onchange={handleBillingDetailsChange}
                />
            </div>
            <div>
            <label htmlFor="country">Country</label>
                <input
                id="country"
                type='text'
                name="country"
                value={billingDetails.country}
                onchange={handleBillingDetailsChange}
                />
            </div>
            <br/>
            <h2>Payment Details</h2>
            <div>
            <label htmlFor="cardHolderName">Card Holder Name</label>
                <input
                id="cardHolderName"
                type='text'
                name="cardHolderName"
                value={paymentDetails.cardHolderName}
                onchange={handlePaymentDetailsChange}
                />
            </div>
            <div>
            <label htmlFor="cardNumber">Card Number</label>
            <CardElement id="cardNumber"
                options={{
                    style:{
                        base:{
                            fontSize:'16px',
                            color: '#424770',
                            '::placeholder': {
                                color: '#aab7c4'
                            }
                        },
                        invalid:{
                            color:'#9e2146'
                        }
                    }
                }}
                />
            </div>
            <div>
            <label htmlFor="expiryMonth">Expiration</label>
                <input
                id="expiryMonth"
                type='text'
                name="expiryMonth"
                placeholder="Month"
                value={paymentDetails.expiryMonth}
                onchange={handlePaymentDetailsChange}
                />
            </div>
            <div>
            <label htmlFor="expiryYear">Expiration</label>
                <input
                id="expiryYear"
                type='text'
                name="expiryYear"
                placeholder="Year"
                value={paymentDetails.expiryYear}
                onchange={handlePaymentDetailsChange}
                />
            </div>
            <div>
            <label htmlFor="cvc">CVC</label>
                <input
                id="cvc"
                type='number'
                name="cvc"
                placeholder="CVC"
                value={paymentDetails.cvc}
                onchange={handlePaymentDetailsChange}
                />
            </div>
            <button type="submit" disabled={!stripe || loading}>
                <Link href='/'>{loading ? 'Processing Payment...': 'Pay Now'}</Link>
            </button>
            {error && <div>{error}</div>}
        </form>
    )
}
    </>)
}

export default function BillingPage({stripePubKey}){

return(
    <Elements stripe={stripePubKey}>
        <billingForm/>
    </Elements>

)
    
}
