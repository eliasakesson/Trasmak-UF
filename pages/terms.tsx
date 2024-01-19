import Head from "next/head";

export default function Terms() {
	return (
		<>
			<Head>
				<title>Köpvillkor - Träsmak UF</title>
				<meta
					name="description"
					content="Köpvillkor för Träsmak UF. Här hittar du information om hur vi hanterar dina personuppgifter, hur du kan reklamera och hur du kan betala."
				/>
				<meta name="robots" content="index, follow" />
			</Head>
			<main className="max-w-7xl mx-auto px-8 py-16 space-y-8 min-h-[calc(100vh-108px)]">
				<article className="flex flex-col gap-4">
					<h1 className="xl:text-6xl lg:text-5xl text-3xl font-bold leading-tight text-gray-900">
						KÖPVILLKOR
					</h1>
					<br />
					<H2>PRISER OCH BETALNING</H2>
					<P>
						Varje vara anges med pris inklusive moms. I kundvagnen
						kan man se det totala priset inklusive alla avgifter,
						moms, frakt och betalning. Betalningsvillkor finns
						angiven i kundvagnen beroende av valt betalningssätt.
					</P>
					<br />
					<H2>ÅNGERRÄTT</H2>
					<P>
						Din ångerrätt (ångerfristen) gäller under 14 dagar. I
						ditt meddelande till oss måste det klart framgå att du
						ångrar dig. Ångerfristen börjar löpa den dag du tog emot
						varan eller en väsentlig del av den.
					</P>
					<br />
					<H3>Du har inte ångerrätt om:</H3>
					<P>
						Varan är specialtillverkad och därmed inte kan säljas
						till en annan kund, till exempel en vara med en
						personlig design. Ångerrätten gäller inte heller en vara
						som har modifierats eller skadats till följd av oaktsam
						hantering.
					</P>
					<br />
					<H3>När du utnyttjat din ångerrätt:</H3>
					<P>
						Du är skyldig att hålla varan i lika gott skick som när
						du fick den. Du får inte använda den, men naturligtvis
						försiktigt undersöka den. Om varan skadas eller kommer
						bort på grund av att du är vårdslös förlorar du
						ångerrätten.
					</P>
					<br />
					<H2>GARANTIER OCH SERVICE</H2>
					<P>
						Om en vara är defekt eller väsentligt avviker från
						beskrivningen, kan den returneras utan ytterligare
						kostnader. Bedömer vi att varan är defekt levererar vi
						en ny vara till dig, vill du inte få en ny vara har du
						rätt att på din begäran få hela summan för varan
						återbetald.
					</P>
					<br />
					<H2>PRIVAT POLICY</H2>
					<P>
						När du lägger din beställning hos oss uppger du dina
						personuppgifter. I samband med din registrering och
						beställning godkänner du att vi lagrar och använder dina
						uppgifter i vår verksamhet för att fullfölja avtalet
						gentemot dig. Du har enligt Personuppgiftslagen rätt att
						få den information som vi har registrerat om dig. Om den
						är felaktig, ofullständig eller irrelevant kan du begära
						att informationen ska rättas eller tas bort. Kontakta
						oss i så fall via e-post.
					</P>
					<br />
					<H2>LEVERANSER</H2>
					<P>
						Leveranstiden anges i kundvagnen under respektive
						fraktsätt. Om en vara har avvikande leveranstid står det
						angivet vid respektive vara.
					</P>
					<br />
					<H2>RETURER</H2>
					<P>
						Returer sker på kundens egen bekostnad utom om varan är
						defekt eller om vi har packat fel. Returer ska skickas
						som brev eller paket, inte mot postförskott. Vid byten
						betalar vi den nya frakten från oss till dig.
						<br /> När du utnyttjat din ångerrätt ska du sända eller
						lämna tillbaka den till oss.
					</P>
					<H3>Återbetalningsskyldighet:</H3>
					<P>
						Vi ska, om du utnyttjat din ångerrätt, betala tillbaka
						vad du har betalat för varan snarast eller senast inom
						30 dagar från den dag då vi tog emot varan eller, om det
						är en tjänst, meddelandet om att du ångrat dig. Du får
						själv betala returkostnaderna när du sänder tillbaka
						varan. Vi betalar alltid returkostnaden för att sända
						tillbaka så kallade ersättningsvaror. Se även
						konsumentverket och distansavtalslagen, samt EU:s
						gemensamma tvistlösningssida{" "}
						<a
							className="text-primary"
							href="http://ec.europa.eu/odr"
						>
							http://ec.europa.eu/odr
						</a>
						.
					</P>
				</article>
			</main>
		</>
	);
}

export function H2({ children }: { children: React.ReactNode }) {
	return (
		<h2 className="xl:text-3xl lg:text-2xl text-xl font-semibold leading-tight text-gray-900">
			{children}
		</h2>
	);
}

export function H3({ children }: { children: React.ReactNode }) {
	return (
		<h3 className="xl:text-2xl lg:text-xl text-lg font-semibold leading-tight text-gray-900">
			{children}
		</h3>
	);
}

export function P({ children }: { children: React.ReactNode }) {
	return <p className="text-gray-700">{children}</p>;
}
