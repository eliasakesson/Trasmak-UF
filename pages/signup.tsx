import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useAnalytics, auth } from "@/firebase";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { logEvent } from "firebase/analytics";

export default function Login() {
	const router = useRouter();
	const { analytics } = useAnalytics();

	const [input, setInput] = useState({
		email: "",
		password: "",
	});

	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const errorMessages = {
		"auth/email-already-in-use": "Emailen används redan",
		"auth/invalid-email": "Ogiltig email",
		"auth/weak-password": "Lösenordet är för svagt",
		"auth/too-many-requests":
			"För många felaktiga inloggningsförsök. Försök igen senare",
	};

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		setLoading(true);
		try {
			await createUserWithEmailAndPassword(
				auth,
				input.email,
				input.password,
			);

			toast.success("Kontot har skapats");
			analytics &&
				logEvent(analytics, "signup", {
					method: "email",
				});
			router.push("/");
		} catch (err: any) {
			const error = err.code as keyof typeof errorMessages;
			if (Object.keys(errorMessages).includes(error)) {
				setError(errorMessages[error]);
			} else {
				setError("Något gick fel. Försök igen senare");
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Head>
				<title>Skapa konto - Träsmak UF</title>
				<meta
					name="description"
					content="Skapa ett konto för att spara dina brickor och fortsätta designa dem senare."
				/>
				<meta name="robots" content="index, follow" />
			</Head>
			<main className="relative pb-16">
				<section className="max-lg:gap-8 flex min-h-[calc(100vh-111px)] flex-col-reverse lg:min-h-[calc(100vh-153px)] lg:flex-row">
					<div className="max-lg:h-1/2 flex lg:flex-1">
						<div className="flex h-full flex-col justify-center gap-8 px-8 py-8 lg:pl-[10vw] lg:pr-[5vw] lg:h-md:pb-[153px]">
							<h1 className="text-3xl font-bold leading-tight text-gray-900 lg:text-5xl xl:text-6xl">
								Skapa ett konto
							</h1>
							<p className="max-w-full text-base text-gray-600 xl:text-xl">
								Med ett konto kan du spara dina brickor och
								fortsätta designa dem senare.
							</p>
							<span>
								{error && (
									<p className="text-sm text-red-500">
										{error}
									</p>
								)}
							</span>
							<form
								onSubmit={handleSubmit}
								className="flex flex-col gap-4"
							>
								<div className="flex flex-col gap-1">
									<label htmlFor="email">Email</label>
									<input
										type="email"
										name="email"
										id="email"
										placeholder="namn@test.com"
										className="h-full rounded-md border border-gray-300 p-3"
										value={input.email}
										onChange={(e) =>
											setInput({
												...input,
												email: e.target.value,
											})
										}
										required
									/>
								</div>
								<div className="flex flex-col gap-1">
									<label htmlFor="password">Lösenord</label>
									<input
										type="password"
										name="password"
										id="password"
										placeholder="********"
										className="h-full rounded-md border border-gray-300 p-3"
										value={input.password}
										onChange={(e) =>
											setInput({
												...input,
												password: e.target.value,
											})
										}
										required
									/>
								</div>
								<button
									type="submit"
									disabled={loading}
									className="flex w-fit items-center gap-2 rounded-md bg-primary px-16 py-3 text-left text-lg font-semibold text-white transition-colors disabled:bg-primary_dark"
								>
									{loading && <Spinner />}
									Skapa konto
								</button>
							</form>
							<p className="text-sm text-gray-600">
								Har du redan ett konto?{" "}
								<Link
									href="/login"
									className="font-semibold text-primary"
								>
									Logga in
								</Link>
							</p>
						</div>
					</div>
					<div className="max-lg:h-1/2 flex flex-1">
						<div className="relative flex-1 overflow-hidden bg-primary">
							<Image
								src="/images/valnöt.jpg"
								layout="fill"
								alt=""
								className="object-cover"
							/>
						</div>
					</div>
				</section>
			</main>
		</>
	);
}
