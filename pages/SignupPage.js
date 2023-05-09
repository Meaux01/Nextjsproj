import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import Link from "next/link";

const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("L name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

export default function SignupPage() {
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  async function handleSignup(data) {
    try {
      const response = await axios.post("/api/signup", data);
      console.log(response.data);
    } catch (error) {
      setError(error.response.data.message);
    }
  }

  return (
    <form onSubmit={handleSubmit(handleSignup)}>
      {error && <div>{error}</div>}
      <div>
        <label htmlFor="firstName">First Name</label>
        <input id="firstName" type="firstName" {...register("firstName")} />
        {errors.firstName && <div>{errors.firstName.message}</div>}
      </div>
      <div>
        <label htmlFor="lastName">Last Name</label>
        <input id="lastName" type="lastName" {...register("lastName")} />
        {errors.lastName && <div>{errors.lastName.message}</div>}
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" {...register("email")} />
        {errors.email && <div>{errors.email.message}</div>}
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" {...register("password")} />
        {errors.password && <div>{errors.password.message}</div>}
      </div>
      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="confirmPassword"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && <div>{errors.confirmPassword.message}</div>}
      </div>
      <button type="submit" disabled={isSubmitting}>
        <Link href="/BillingPage">Signup</Link>
        Signup
      </button>
    </form>
  );
}
