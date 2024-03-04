import { auth, db } from "@/firebase";
import { ref, set } from "firebase/database";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import toast from "react-hot-toast";
import { AiOutlineLoading } from "react-icons/ai";
import { FaCheck } from "react-icons/fa";
import { MdBugReport } from "react-icons/md";
import { motion } from "framer-motion";

export default function BugReport() {
	const router = useRouter();
	const [user] = useAuthState(auth);

	const [status, setStatus] = useState<"idle" | "loading" | "success">(
		"idle",
	);
	const [formValues, setFormValues] = useState({
		heading: "",
		description: "",
		email: "",
		notify: false,
	});

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setStatus("loading");

		const toastID = toast.loading("Skickar bugg-rapport...");

		const designRef = ref(db, `bug-reports/${Date.now()}`);

		const data = {
			...formValues,
			email: user ? user.email : formValues.email,
		};

		set(designRef, data)
			.then(() => {
				setStatus("success");
				toast.success("Bugg-rapporten har skickats!");
			})
			.catch((error) => {
				setStatus("idle");
				toast.error("Något gick fel. Försök igen.");
			})
			.finally(() => {
				toast.dismiss(toastID);
				setFormValues({
					heading: "",
					description: "",
					email: "",
					notify: false,
				});
			});
	}

	return (
		<main className="mx-auto flex min-h-[calc(100vh-108px)] w-full max-w-7xl flex-col items-center space-y-16 px-8 py-16">
			<div className="flex w-full flex-col items-center gap-6 border-b pb-8">
				<MdBugReport className="text-6xl text-primary" />
				<h1 className="text-4xl font-bold text-gray-900">
					Bugg-rapportering
				</h1>
				<span className="max-w-prose text-center text-muted">
					Vi ber om ursäkt för eventuella problem du stött på. Vi
					kommer att göra vårt bästa för att lösa problemet så snabbt
					som möjligt. Tack för att du hjälper oss att förbättra vår
					app.
				</span>
			</div>
			<form
				className="w-[500px] max-w-full space-y-4"
				onSubmit={handleSubmit}
			>
				<TextInput
					label="Titel"
					type="text"
					placeholder="Bugg i..."
					name="heading"
					required
					value={formValues.heading}
					onChange={(e) =>
						setFormValues((prev) => ({
							...prev,
							heading: e.target.value,
						}))
					}
				/>
				<TextArea
					label="Beskrivning"
					placeholder="Buggen uppstår när jag..."
					rows={5}
					name="description"
					required
					value={formValues.description}
					onChange={(e) =>
						setFormValues((prev) => ({
							...prev,
							description: e.target.value,
						}))
					}
				/>
				<Checkbox
					label={`Meddela mig när buggen är löst${user ? `, ${user.email}` : ""}`}
					name="notify"
					checked={formValues.notify}
					onChange={(e) =>
						setFormValues((prev) => ({
							...prev,
							notify: e.target.checked,
						}))
					}
				/>
				{formValues.notify && !user && (
					<TextInput
						label="E-post"
						type="email"
						placeholder="exempel@domän.se"
						name="email"
						required
						value={formValues.email}
						onChange={(e) =>
							setFormValues((prev) => ({
								...prev,
								email: e.target.value,
							}))
						}
					/>
				)}
				<button
					disabled={status === "loading"}
					type="submit"
					className="flex w-full items-center justify-center gap-4 rounded-lg bg-primary px-8 py-4 font-semibold text-white transition-colors hover:bg-primary_light disabled:bg-primary_dark 2xl:px-16"
				>
					{status === "loading" ? (
						<>
							<AiOutlineLoading className="animate-spin text-xl" />
							<span>Skickar...</span>
						</>
					) : (
						"Skicka"
					)}
				</button>
			</form>
			{status === "success" && (
				<motion.div
					initial={{ backdropFilter: "blur(0)" }}
					animate={{ backdropFilter: "blur(4px)" }}
					className="fixed bottom-0 left-0 right-0 top-0 z-10 flex items-center justify-center p-4"
				>
					<motion.div
						initial={{ translateY: "25%", opacity: 0 }}
						animate={{ translateY: 0, opacity: 1 }}
						className="flex flex-col items-center gap-4 rounded-xl bg-primary p-16 text-white"
					>
						<FaCheck className="text-5xl" />
						<span className="text-2xl font-semibold">
							Tack för din rapport!
						</span>
						<br />
						<button
							onClick={() => router.back()}
							className="w-full rounded-lg bg-white px-8 py-4 font-semibold text-black transition-colors hover:bg-slate-100"
						>
							Gå tillbaka
						</button>
						<button
							onClick={() => setStatus("idle")}
							className="w-full rounded-lg border-2 px-8 py-4 font-semibold text-white transition-colors hover:bg-slate-100 hover:bg-opacity-10"
						>
							Skapa en ny rapport
						</button>
					</motion.div>
				</motion.div>
			)}
		</main>
	);
}

function TextArea({
	label,
	...props
}: {
	label: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
	return (
		<div className="relative flex grow flex-col gap-1">
			<Label label={label} />
			<textarea
				{...props}
				id={label}
				className="h-full resize-y rounded-md border border-gray-300 p-2 pt-6"
			/>
		</div>
	);
}

function TextInput({
	label,
	...props
}: {
	label: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
	return (
		<div className="relative flex grow flex-col gap-1">
			<Label label={label} />
			<input
				{...props}
				id={label}
				className="h-full rounded-md border border-gray-300 p-2 pt-6"
			/>
		</div>
	);
}

function Checkbox({
	label,
	...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
	return (
		<div className="flex items-center gap-2">
			<input {...props} type="checkbox" id={label} />
			<label htmlFor={label}>{label}</label>
		</div>
	);
}

function Label({ label }: { label: string }) {
	return (
		<label
			className="absolute left-2 top-1 text-xs text-muted"
			htmlFor={label}
		>
			{label}
		</label>
	);
}
