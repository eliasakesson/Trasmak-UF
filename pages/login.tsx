import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import Spinner from "@/components/Spinner";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { logEvent, getAnalytics } from "firebase/analytics";

export default function Login() {
	const router = useRouter();
	const analytics = getAnalytics();

	const [input, setInput] = useState({
		email: "",
		password: "",
	});

	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const errorMessages = {
		"auth/invalid-credential": "Ogiltig inloggningsuppgift",
		"auth/invalid-email": "Ogiltig email",
		"auth/user-not-found": "Användaren finns inte",
		"auth/wrong-password": "Fel lösenord",
		"auth/too-many-requests":
			"För många felaktiga inloggningsförsök. Försök igen senare",
	};

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		setLoading(true);
		try {
			await signInWithEmailAndPassword(auth, input.email, input.password);

			toast.success("Du är nu inloggad");
			logEvent(analytics, "login", {
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
				<title>Logga in - Träsmak UF</title>
				<meta
					name="description"
					content="Logga in på ditt konto för att fortsätta designa dina brickor."
				/>
				<meta name="robots" content="noindex, follow" />
			</Head>
			<main className="relative pb-16">
				<section className="lg:min-h-[calc(100vh-153px)] min-h-[calc(100vh-111px)] flex lg:flex-row flex-col-reverse max-lg:gap-8">
					<div className="flex-1 flex max-lg:h-1/2 lg:order-1 order-2">
						<div className="flex-1 bg-primary relative overflow-hidden">
							<Image
								src="/images/section1.jpg"
								layout="fill"
								alt=""
								className="object-cover"
							/>
						</div>
					</div>
					<div className="lg:flex-1 flex max-lg:h-1/2 order-1">
						<div className="lg:pl-[5vw] lg:pr-[10vw] px-8 lg:h-md:pb-[183px] py-8 flex flex-col justify-center gap-8 h-full">
							<h1 className="xl:text-6xl lg:text-5xl text-3xl font-bold leading-tight text-gray-900">
								Logga in
							</h1>
							<p className="xl:text-xl text-base text-gray-600 max-w-full">
								Logga in på ditt konto för att fortsätta designa
								dina brickor.
							</p>
							<span>
								{error && (
									<p className="text-red-500 text-sm">
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
										className="border border-gray-300 rounded-md p-3 h-full"
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
										className="border border-gray-300 rounded-md p-3 h-full"
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
									className="flex items-center gap-2 bg-primary text-white text-left w-fit text-lg font-semibold px-16 py-3 rounded-md disabled:bg-primary_dark transition-colors"
								>
									{loading && <Spinner />}
									Logga in
								</button>
							</form>
							<p className="text-gray-600 text-sm">
								Har du inget konto?{" "}
								<Link
									href="/signup"
									className="text-primary font-semibold"
								>
									Skapa konto
								</Link>
							</p>
						</div>
					</div>
				</section>
			</main>
		</>
	);
}
