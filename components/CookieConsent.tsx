import { useEffect, useState } from "react";
import { getAnalytics } from "firebase/analytics";
import { app, useAnalytics } from "@/firebase";

export default function CookieConsent() {
	const { activateAnalytics, deActivateAnalytics } = useAnalytics();

	const [showMenu, setShowMenu] = useState<"none" | "popup" | "settings">(
		"none",
	);

	useEffect(() => {
		if (localStorage.getItem("cookieConsent") === null) {
			setShowMenu("popup");
		} else if (localStorage.getItem("cookieConsent") === "true") {
			activateAnalytics();
		}
	}, []);

	function handleAccept() {
		setShowMenu("none");
		localStorage.setItem("cookieConsent", "true");
		activateAnalytics();
	}

	function handleDecline() {
		setShowMenu("none");
		localStorage.setItem("cookieConsent", "false");
		deActivateAnalytics();
	}

	return (
		<>
			{showMenu === "popup" && (
				<CookiePopup
					onAccept={handleAccept}
					onSettings={() => setShowMenu("settings")}
				/>
			)}
			{showMenu === "settings" && (
				<CookieSettings
					onAccept={handleAccept}
					onDecline={handleDecline}
				/>
			)}
		</>
	);
}

function CookiePopup({
	onAccept,
	onSettings,
}: {
	onAccept: () => void;
	onSettings: () => void;
}) {
	return (
		<div className="fixed bottom-8 left-4 right-4 z-50 flex flex-col gap-4 rounded-lg border-2 bg-white p-4 lg:left-1/2 lg:right-auto lg:-translate-x-1/2 lg:p-8">
			<h3 className="text-2xl font-semibold">Cookies inställningar</h3>
			<p className="max-w-prose text-sm">
				Denna hemsida använder cookies och andra spårningstekniker för
				att ge dig den bästa upplevelsen. Genom att acceptera godkänner
				du att vi samlar in data om ditt besök.
			</p>
			<div className="flex gap-2">
				<button
					onClick={onAccept}
					className="w-full rounded-lg bg-primary px-4 py-2 font-semibold text-white transition-colors hover:bg-primary_light lg:w-fit 2xl:px-8"
				>
					Acceptera cookies
				</button>
				<button
					onClick={onSettings}
					className="w-full rounded-lg border-2 px-4 py-2 font-semibold transition-colors hover:bg-slate-100 lg:w-fit 2xl:px-8"
				>
					Inställningar
				</button>
			</div>
		</div>
	);
}

function CookieSettings({
	onAccept,
	onDecline,
}: {
	onAccept: () => void;
	onDecline: () => void;
}) {
	const [analytics, setAnalytics] = useState<boolean>(true);

	function onSave() {
		if (analytics) {
			onAccept();
		} else {
			onDecline();
		}
	}

	return (
		<div className="fixed bottom-0 left-0 right-0 top-0 z-50 grid place-items-center bg-black bg-opacity-20 px-4">
			<div className="flex flex-col gap-4 rounded-lg border-2 bg-white p-8">
				<h3 className="text-3xl font-bold">Cookie inställningar</h3>
				<p className="max-w-prose">
					Denna hemsida använder cookies och andra spårningstekniker
					för att ge dig den bästa upplevelsen. Genom att acceptera
					godkänner du att vi samlar in data om ditt besök.
				</p>
				<div className="flex items-center justify-between rounded-lg border-2 p-4">
					<h4 className="text-xl font-semibold">
						Nödvändiga cookies
					</h4>
					<div className="flex flex-col items-end gap-4 lg:flex-row lg:items-center">
						<span className="whitespace-nowrap rounded-full bg-slate-200 px-3">
							Alltid på
						</span>
						<label className="relative inline-flex cursor-pointer items-center">
							<input
								type="checkbox"
								value=""
								className="peer sr-only"
								checked
								disabled
							/>
							<div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700"></div>
						</label>
					</div>
				</div>
				<div className="flex items-center justify-between rounded-lg border-2 p-4">
					<h4 className="text-xl font-semibold">Statistik cookies</h4>
					<label className="relative inline-flex cursor-pointer items-center">
						<input
							type="checkbox"
							value=""
							className="peer sr-only"
							checked={analytics}
							onChange={(e) => setAnalytics(e.target.checked)}
						/>
						<div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700"></div>
					</label>
				</div>
				<div className="flex flex-col gap-2 lg:flex-row">
					<button
						onClick={onAccept}
						className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary_light lg:w-fit 2xl:px-12"
					>
						Acceptera alla
					</button>
					<button
						onClick={onSave}
						className="w-full rounded-lg border-2 px-6 py-3 font-semibold transition-colors hover:bg-slate-100 lg:w-fit 2xl:px-12"
					>
						Spara inställningar
					</button>
				</div>
			</div>
		</div>
	);
}
