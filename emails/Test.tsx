import {
	Body,
	Button,
	Column,
	Container,
	Head,
	Heading,
	Html,
	Img,
	Link,
	Preview,
	Row,
	Section,
	Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import * as React from "react";

interface NetlifyWelcomeEmailProps {
	steps?: {
		id: number;
		Description: React.ReactNode;
	}[];
	links?: string[];
}

const baseUrl = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: "";

const PropDefaults: NetlifyWelcomeEmailProps = {
	steps: [
		{
			id: 1,
			Description: (
				<li className="mb-20" key={1}>
					<strong>Deploy your first project.</strong>{" "}
					<Link>Connect to Git, choose a template</Link>, or manually
					deploy a project you've been working on locally.
				</li>
			),
		},
		{
			id: 2,
			Description: (
				<li className="mb-20" key={2}>
					<strong>Check your deploy logs.</strong> Find out what's
					included in your build and watch for errors or failed
					deploys. <Link>Learn how to read your deploy logs</Link>.
				</li>
			),
		},
		{
			id: 3,
			Description: (
				<li className="mb-20" key={3}>
					<strong>Choose an integration.</strong> Quickly discover,
					connect, and configure the right tools for your project with
					150+ integrations to choose from.{" "}
					<Link>Explore the Integrations Hub</Link>.
				</li>
			),
		},
		{
			id: 4,
			Description: (
				<li className="mb-20" key={4}>
					<strong>Set up a custom domain.</strong> You can register a
					new domain and buy it through Netlify or assign a domain you
					already own to your site. <Link>Add a custom domain</Link>.
				</li>
			),
		},
	],
	links: ["Visit the forums", "Read the docs", "Contact an expert"],
};

export const NetlifyWelcomeEmail = ({
	steps = PropDefaults.steps,
	links = PropDefaults.links,
}: NetlifyWelcomeEmailProps) => {
	return (
		<Html>
			<Head />
			<Preview>Netlify Welcome</Preview>
			<Tailwind
				config={{
					theme: {
						extend: {
							colors: {
								brand: "#2250f4",
								offwhite: "#fafbfb",
							},
							spacing: {
								0: "0px",
								20: "20px",
								45: "45px",
							},
						},
					},
				}}
			>
				<Body className="bg-offwhite font-sans text-base">
					<Img
						src={`${baseUrl}/static/netlify-logo.png`}
						width="184"
						height="75"
						alt="Netlify"
						className="mx-auto my-20"
					/>
					<Container className="p-45 bg-white">
						<Heading className="my-0 text-center leading-8">
							Är du nöjd med din bricka?
						</Heading>
						<Section>
							<Row>
								<Text className="text-base">
									Din åsikt betyder mycket för oss. Vi skulle
									uppskatta om du tog dig tid att recensera
									produkten för att hjälpa andra kunder.
								</Text>

								<Text className="text-base">
									Here's how to get started:
								</Text>
							</Row>
						</Section>

						<ul>{steps?.map(({ Description }) => Description)}</ul>

						<Section className="text-center">
							<Button className="bg-brand rounded-lg px-[18px] py-3 text-white">
								Go to your dashboard
							</Button>
						</Section>

						<Section className="mt-45">
							<Row>
								{links?.map((link) => (
									<Column key={link}>
										<Link className="font-bold text-black underline">
											{link}
										</Link>{" "}
										<span className="text-green-500">
											→
										</span>
									</Column>
								))}
							</Row>
						</Section>
					</Container>

					<Container className="mt-20">
						<Section>
							<Row>
								<Column className="px-20 text-right">
									<Link>Unsubscribe</Link>
								</Column>
								<Column className="text-left">
									<Link>Manage Preferences</Link>
								</Column>
							</Row>
						</Section>
						<Text className="mb-45 text-center text-gray-400">
							Netlify, 44 Montgomery Street, Suite 300 San
							Francisco, CA
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default NetlifyWelcomeEmail;
