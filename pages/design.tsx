// Redirect to: pages/designer.tsx
// Reason: This page is not used anymore

import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

const DesignPage: NextPage = () => {
	const router = useRouter();

	useEffect(() => {
		router.replace("/designer");
	}, []);

	return null;
};
