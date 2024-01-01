import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
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
					<div className="lg:flex-1 flex max-lg:h-1/2">
						<div className="lg:pl-[10vw] lg:pr-[5vw] px-8 lg:h-md:pb-[153px] py-8 flex flex-col justify-center gap-8 h-full">
							<h1 className="xl:text-6xl lg:text-5xl text-3xl font-bold leading-tight text-gray-900">
								Skapa ett konto
							</h1>
							<p className="xl:text-xl text-base text-gray-600 max-w-full">
								Med ett konto kan du spara dina brickor och
								fortsätta designa dem senare.
							</p>
							<div className="flex flex-col gap-4">
								<div className="flex flex-col gap-1">
									<label htmlFor="email">Email</label>
									<input
										type="email"
										name="email"
										id="email"
										placeholder="namn@test.com"
										className="border border-gray-300 rounded-md p-3 h-full"
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
									/>
								</div>
							</div>
							<button className="bg-primary text-white text-left w-fit text-lg font-semibold px-16 py-3 rounded-md">
								Skapa konto
							</button>
							<p className="text-gray-600 text-sm">
								Har du redan ett konto?{" "}
								<Link
									href="/login"
									className="text-primary font-semibold">
									Logga in
								</Link>
							</p>
						</div>
					</div>
					<div className="flex-1 flex max-lg:h-1/2">
						<div className="flex-1 bg-primary relative overflow-hidden">
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
