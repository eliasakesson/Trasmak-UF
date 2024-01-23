import { useEffect, useState } from "react";
import { getAnalytics } from "firebase/analytics";
import { app, useAnalytics } from "@/firebase";

export default function CookieConsent() {
	const { analytics, activateAnalytics, deActivateAnalytics } =
		useAnalytics();

	const [showMenu, setShowMenu] = useState<"none" | "popup" | "settings">(
		"none"
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
		<div className="fixed bottom-8 lg:left-1/2 lg:right-auto lg:-translate-x-1/2 left-4 right-4 z-50 bg-white border-2 rounded-lg lg:p-8 p-4 flex flex-col gap-4">
			<h3 className="text-2xl font-semibold">Cookies inställningar</h3>
			<p className="text-sm max-w-prose">
				Denna hemsida använder cookies och andra spårningstekniker för
				att ge dig den bästa upplevelsen. Genom att acceptera godkänner
				du att vi samlar in data om ditt besök.
			</p>
			<div className="flex gap-2">
				<button
					onClick={onAccept}
					className="bg-primary text-white lg:w-fit w-full 2xl:px-8 px-4 py-2 font-semibold rounded-lg hover:bg-primary_light transition-colors">
					Acceptera cookies
				</button>
				<button
					onClick={onSettings}
					className="border-2 lg:w-fit w-full 2xl:px-8 px-4 py-2 font-semibold rounded-lg hover:bg-slate-100 transition-colors">
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
		<div className="fixed top-0 left-0 bottom-0 right-0 bg-black bg-opacity-20 grid place-items-center z-50 px-4">
			<div className="bg-white border-2 rounded-lg p-8 flex flex-col gap-4">
				<h3 className="text-3xl font-bold">Cookie inställningar</h3>
				<p className="max-w-prose">
					Denna hemsida använder cookies och andra spårningstekniker
					för att ge dig den bästa upplevelsen. Genom att acceptera
					godkänner du att vi samlar in data om ditt besök.
				</p>
				<div className="flex items-center justify-between border-2 p-4 rounded-lg">
					<h4 className="text-xl font-semibold">
						Nödvändiga cookies
					</h4>
					<div className="flex lg:flex-row flex-col lg:items-center items-end gap-4">
						<span className="bg-slate-200 px-3 rounded-full whitespace-nowrap">
							Alltid på
						</span>
						<label className="relative inline-flex items-center cursor-pointer">
							<input
								type="checkbox"
								value=""
								className="sr-only peer"
								checked
								disabled
							/>
							<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
						</label>
					</div>
				</div>
				<div className="flex items-center justify-between border-2 p-4 rounded-lg">
					<h4 className="text-xl font-semibold">Statistik cookies</h4>
					<label className="relative inline-flex items-center cursor-pointer">
						<input
							type="checkbox"
							value=""
							className="sr-only peer"
							checked={analytics}
							onChange={(e) => setAnalytics(e.target.checked)}
						/>
						<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
					</label>
				</div>
				<div className="flex lg:flex-row flex-col gap-2">
					<button
						onClick={onAccept}
						className="bg-primary text-white lg:w-fit w-full 2xl:px-12 px-6 py-3 font-semibold rounded-lg hover:bg-primary_light transition-colors">
						Acceptera alla
					</button>
					<button
						onClick={onSave}
						className="border-2 lg:w-fit w-full 2xl:px-12 px-6 py-3 font-semibold rounded-lg hover:bg-slate-100 transition-colors">
						Spara inställningar
					</button>
				</div>
			</div>
		</div>
	);
}
