import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function Login() {
	const [input, setInput] = useState({
		email: "",
		password: "",
	});

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		try {
			await signInWithEmailAndPassword(auth, input.email, input.password);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<>
			<Head>
				<title>Träsmak UF</title>
				<meta
					name="description"
					content="Skapa en personlig bricka med vårt enkla verktyg. Utgå från en av våra färdiga mallar eller skapa en helt egen design. Välj mellan olika storlekar och få en närproducerad bricka levererad till dörren."
				/>
			</Head>
			<main className="relative pb-16">
				<section className="lg:min-h-[calc(100vh-153px)] min-h-[calc(100vh-111px)] flex lg:flex-row flex-col-reverse max-lg:gap-8">
					<div className="flex-1 flex max-lg:h-1/2 md:order-1 order-2">
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
							<form
								onSubmit={handleSubmit}
								className="flex flex-col gap-4">
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
									/>
								</div>
							</form>
							<button
								onClick={handleSubmit}
								className="bg-primary text-white text-left w-fit text-lg font-semibold px-16 py-3 rounded-md">
								Logga in
							</button>
							<p className="text-gray-600 text-sm">
								Har du inget konto?{" "}
								<Link
									href="/signup"
									className="text-primary font-semibold">
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
