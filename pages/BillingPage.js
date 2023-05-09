import { useState } from "react";
import Head from 'next/head';
import Link from "next/link";
import {useStripe, useELements, CardElement} from '@stripe/react-stripe-js';
import axios from "axios";
import { siteTitle } from "../components/layouts";

export default function BillingPage(){
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const stripe = useStripe();
    const elements = useELements();

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

        const {paymentMethod, error} = await stripe.createPaymentMethod({
            type:'card',
            card: elements.getElement(CardElement),
            billing_details:billingDetails,
        })
        
        if(error){
            setError(error.message);
            setLoading(false);
        }else{

            // Send the payment method ID to your server to complete the payment

            const response = await axios.post('/api/charge',{
                paymentMethodId: paymentMethod.id,
                billingDetails
            })
        }
        if (response.data.status === 'succeeded'){
            setSuccess(true);
        }else{
            setError(response.data.message)
        }

        setLoading(false)
    }
return(
    <>
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
    ) : (<elements>

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
                value={billingDetails.cardHolderName}
                onchange={handlePaymentDetailsChange}
                />
            </div>
            <div>
            <label htmlFor="cardNumber">Card Number</label>
                <input
                id="cardNumber"
                type='text'
                name="cardNumber"
                value={billingDetails.cardNumber}
                onchange={handlePaymentDetailsChange}
                />
            </div>
            <div>
            <label htmlFor="expiryMonth">Expiration</label>
                <input
                id="expiryMonth"
                type='text'
                name="expiryMonth"
                placeholder="Month"
                value={billingDetails.expiryMonth}
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
                value={billingDetails.expiryYear}
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
                value={billingDetails.cvc}
                onchange={handlePaymentDetailsChange}
                />
            </div>
        </form>
                </elements>
    )
    }
    </>
)
    
}