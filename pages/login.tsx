import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useAnalytics, auth } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import Spinner from "@/components/Spinner";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
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
			analytics &&
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
				<meta name="robots" content="index, follow" />
			</Head>
			<main className="relative pb-16">
				<section className="max-lg:gap-8 flex min-h-[calc(100vh-111px)] flex-col-reverse lg:min-h-[calc(100vh-153px)] lg:flex-row">
					<div className="max-lg:h-1/2 order-2 flex flex-1 lg:order-1">
						<div className="relative flex-1 overflow-hidden bg-primary">
							<Image
								src="/images/section1.jpg"
								layout="fill"
								alt=""
								className="object-cover"
							/>
						</div>
					</div>
					<div className="max-lg:h-1/2 order-1 flex lg:flex-1">
						<div className="flex h-full flex-col justify-center gap-8 px-8 py-8 lg:pl-[5vw] lg:pr-[10vw] lg:h-md:pb-[183px]">
							<h1 className="text-3xl font-bold leading-tight text-gray-900 lg:text-5xl xl:text-6xl">
								Logga in
							</h1>
							<p className="max-w-full text-base text-gray-600 xl:text-xl">
								Logga in på ditt konto för att fortsätta designa
								dina brickor.
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
									Logga in
								</button>
							</form>
							<p className="text-sm text-gray-600">
								Har du inget konto?{" "}
								<Link
									href="/signup"
									className="font-semibold text-primary"
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
