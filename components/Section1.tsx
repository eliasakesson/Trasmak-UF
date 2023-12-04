import Image from "next/image";
import Link from "next/link";
import { LuRecycle } from "react-icons/lu";
import { PiForkKnifeFill } from "react-icons/pi";

export default function Section1() {
	return (
		<div>
			<section className="flex lg:flex-row flex-col">
				<div className="flex-1 flex">
					<div className="lg:h-[60vh] h-[40vh] flex-1 bg-primary lg:rounded-tr-[10vh] overflow-hidden p-2">
						<Image
							src="/images/section1.jpg"
							alt=""
							className="h-full w-full object-cover lg:rounded-tr-[calc(10vh-8px)]"
							width={800}
							height={600}
						/>
					</div>
				</div>
				<div className="lg:flex-1 flex">
					<div className="lg:pr-[10vw] lg:pl-[5vw] px-8 py-8 flex flex-col justify-center gap-8 h-full">
						<h2 className="xl:text-5xl lg:text-4xl text-3xl font-bold leading-tight text-gray-900">
							En personlig bricka för alla tillfällen
						</h2>
						<p className="xl:text-xl text-base text-gray-600 max-w-full">
							Våra brickor är perfekta för alla tillfällen. De är
							lika fina att ha på köksbordet som att servera kaffe
							på. Eller varför inte ge bort en personlig bricka
							som present?
						</p>
						<Link
							href="/design"
							className="bg-primary text-white lg:w-fit w-full 2xl:px-16 px-8 py-4 font-semibold rounded-lg hover:bg-primary_light transition-colors"
						>
							Designa din bricka
						</Link>
					</div>
				</div>
			</section>
			<div className="relative overflow-hidden w-full lg:h-0 h-[20vh] bg-primary_dark lg:p-0 p-2 flex items-center justify-center">
				<Image
					src="/images/logo.png"
					alt=""
					width={400}
					height={200}
					className="w-2/3 brightness-200"
				/>
			</div>
			<section className="flex lg:flex-row flex-col">
				<div className="lg:flex-1 flex">
					<div className="lg:pl-[10vw] lg:pr-[5vw] px-8 py-8 flex flex-col justify-center gap-8 h-full">
						<h2 className="xl:text-5xl lg:text-4xl text-3xl font-bold leading-tight text-gray-900">
							Tillverkade i Sverige med kärlek och omtanke om
							miljön
						</h2>
						<p className="xl:text-xl text-base text-gray-600 max-w-full">
							Vi tillverkar våra brickor i Sverige med enbart
							närproducerade och återvinningsbara material. Vi
							använder oss av FSC certifierad björkfaner, som även
							är godkänd för kontakt med livsmedel.
						</p>
						<Link
							href="/products"
							className="bg-primary text-white lg:w-fit w-full 2xl:px-16 px-8 py-4 font-semibold rounded-lg hover:bg-primary_light transition-colors"
						>
							Se våra brickor
						</Link>
					</div>
				</div>
				<div className="flex-1 flex">
					<div className="flex-1 bg-primary lg:rounded-bl-[10vh]">
						<div className="xl:p-32 lg:p-16 p-8 flex flex-col justify-between h-full">
							<div className="flex gap-8 items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="120"
									height="120"
									viewBox="0 0 166.84 200"
									fill="#fff"
								>
									<path d="M97.631.735c-40.224 0-54.418 62.313-67.641 112.439-4.783-4.82-19.502-19.458-19.517-19.434-2.96-2.924-6.36-1.973-8.443.053-2.096 2.105-2.402 5.965 0 8.307.121.104 19.944 19.813 26.795 26.645 1.89 1.834 4.625 2.914 7.358 1.322 2.832-1.738 3.22-4.809 3.297-4.809C62.965 20.336 83.953 12.512 97.576 12.512c11.46 0 24.667 8.439 24.667 25.321 17.09 0 27.801 22.391 14.047 36.174 11.403 5.501 16.489 12.266 16.489 20.826 0 8.569-7.196 17.317-17.7 17.294-10.416 0-15.709-6.674-23.824-6.703-3.68 0-5.912 2.965-5.912 5.889v21.183H90.021v-21.104c-.043-3.307-2.484-5.908-5.525-5.908-.049 0-1.311.037-1.292.08l-20.521 2.521c-2.475.373-4.761 3.053-4.761 5.82 0 3.244 2.666 5.938 6.302 5.893.463 0 1.085 0 1.024-.053-.037 0 12.99-1.65 12.99-1.65v20.908c0 2.645 3.009 5.24 5.713 5.24h27.261c3.17 0 5.925-2.729 5.925-5.932v-19.094c5.704 3.469 13.639 4.812 17.709 4.812 15.293 0 29.879-11.983 29.836-29.563-.06-15.935-12.293-23.894-12.293-23.894 7.18-19.062-4.433-37.465-19.472-42.583C127.495 8.327 110.65.735 97.631.735" />
									<path d="M97.631.735c-40.224 0-54.418 62.313-67.641 112.439-4.783-4.82-19.502-19.458-19.517-19.434-2.96-2.924-6.36-1.973-8.443.053-2.096 2.105-2.402 5.965 0 8.307.121.104 19.944 19.813 26.795 26.645 1.89 1.834 4.625 2.914 7.358 1.322 2.832-1.738 3.22-4.809 3.297-4.809C62.965 20.336 83.953 12.512 97.576 12.512c11.46 0 24.667 8.439 24.667 25.321 17.09 0 27.801 22.391 14.047 36.174 11.403 5.501 16.489 12.266 16.489 20.826 0 8.569-7.196 17.317-17.7 17.294-10.416 0-15.709-6.674-23.824-6.703-3.68 0-5.912 2.965-5.912 5.889v21.183H90.021v-21.104c-.043-3.307-2.484-5.908-5.525-5.908-.049 0-1.311.037-1.292.08l-20.521 2.521c-2.475.373-4.761 3.053-4.761 5.82 0 3.244 2.666 5.938 6.302 5.893.463 0 1.085 0 1.024-.053-.037 0 12.99-1.65 12.99-1.65v20.908c0 2.645 3.009 5.24 5.713 5.24h27.261c3.17 0 5.925-2.729 5.925-5.932v-19.094c5.704 3.469 13.639 4.812 17.709 4.812 15.293 0 29.879-11.983 29.836-29.563-.06-15.935-12.293-23.894-12.293-23.894 7.18-19.062-4.433-37.465-19.472-42.583C127.495 8.327 110.65.735 97.631.735M80.462 167.559c0 4.926 5.513 7.898 14.597 12.205 7.205 3.359 11.349 6.92 11.349 9.783 0 4.627-4.988 6.266-9.665 6.266-7.235 0-11.506-2.875-13.875-9.328l-.207-.545h-.584c-1.271 0-2.284.06-2.848.744-.503.662-.361 1.529-.155 2.373-.016-.02 1.598 6.617 1.598 6.617.431 1.613 1.014 1.875 3.599 2.383 1.133.195 6.983 1.207 11.939 1.207 13.823 0 19.993-5.598 19.993-11.154 0-4.045-4.017-7.91-12.683-12.227l-3.937-1.893c-5.929-2.816-9.521-4.49-9.521-7.461 0-2.877 3.719-4.879 9.024-4.879 6.929 0 8.776 3.859 9.625 7.219l.149.631h.656c1.541 0 2.515-.127 3.084-.746.332-.352.467-.838.387-1.406l-.54-5.732c-.152-1.846-1.558-2.11-3.511-2.506-2.324-.412-5.102-.916-9.299-.916-12.008-.001-19.175 3.507-19.175 9.365M120.275 179.162c0 9.979 8.681 20.102 25.308 20.102 8.377 0 13.084-1.916 16.599-3.777l.946-.498-1.532-1.711.084.086c-.371-.51-.66-.612-1.224-.612l-.808.278c-1.26.582-5.104 2.359-12.08 2.359-8.598 0-17.848-5.588-17.848-17.895 0-11.707 10.041-15.844 18.598-15.844 6.168 0 9.447 2.191 10.058 6.732l.069.741h.767c.733 0 2.683 0 2.683-1.457v-6.821c0-1.683-1.933-1.912-2.738-2.033l-.805-.115c-1.972-.256-3.863-.504-8.867-.504-16.93 0-29.21 8.821-29.21 20.969M57.652 158.686l-14.97.121-9.975-.164-1.517-.035c-.889 0-1.528.638-1.528 1.56 0 .425 0 1.767 1.652 1.767 6.029 0 6.251.483 6.306 2.789l.058 1.451.094 6.148v13.23c0 2.188-.079 5.678-.222 8.489-.04.813-.081 1.578-5.404 1.578-1.51 0-2.402.304-2.402 1.761 0 .436 0 1.559 1.447 1.559h.334c.636-.031 2.323-.109 10.654-.109 8.874 0 10.654.092 11.258.109h.312c1.165 0 2.178-.109 2.178-1.559 0-1.625-1.346-1.761-3.597-1.761-5.347 0-5.39-.765-5.429-1.562-.127-2.582-.236-6.07-.236-8.508v-4.775h4.486c6.863 0 7.624.195 8.607 5.465.282 1.148 1.2 1.293 1.965 1.293 1.614 0 1.79-.879 1.79-1.27l-.136-1.98a41.738 41.738 0 0 1-.225-4.452v-8.108c0-1.215-1.468-1.215-2.251-1.215-1.294 0-1.595.819-2.417 4.653-.379 1.454-3.212 2.299-7.773 2.299h-4.046v-11.907c0-3.244.574-3.27 1.289-3.279 2.626-.121 8.986-.34 10.898-.34 1.819 0 3.493.416 4.561 1.121 3.403 2.098 5.141 3.528 6.196 4.391 1.032.824 1.61 1.311 2.448 1.311.498 0 1.941 0 1.941-1.248 0-.305-.137-.584-.601-1.615-.549-1.225-1.483-3.231-2.666-6.318-.343-.982-1.465-.982-3.564-.982l-9.515.092zM152.573 12.794h2.114c.967 0 1.638-.158 2.027-.431.373-.279.564-.676.564-1.197 0-.492-.191-.889-.543-1.171-.357-.273-1.082-.428-2.178-.428h-1.986l.002 3.227zm7.305 6.023h-2.127c-1.33-2.417-2.217-3.773-2.61-4.091-.414-.304-.916-.452-1.537-.452h-1.029v4.543h-1.738V8.123h3.725c1.109 0 1.947.08 2.556.252.598.139 1.086.473 1.459.989.375.497.569 1.067.569 1.652 0 .731-.266 1.386-.807 1.987-.525.601-1.277.935-2.27 1.013v.03c.631.158 1.477 1.053 2.49 2.691l1.319 2.08zm-4.678 2.806c2.291 0 4.241-.8 5.87-2.432 1.63-1.635 2.462-3.585 2.476-5.89 0-2.284-.819-4.24-2.45-5.854-1.638-1.614-3.604-2.44-5.896-2.44-2.293 0-4.267.812-5.877 2.426-1.628 1.628-2.435 3.584-2.447 5.868 0 2.29.819 4.255 2.433 5.875 1.627 1.627 3.584 2.447 5.891 2.447m.041-18.261c2.717 0 5.053.967 7.01 2.899 1.974 1.956 2.949 4.304 2.949 7.039 0 2.742-.978 5.089-2.925 7.036-1.952 1.941-4.297 2.923-7.034 2.923-2.761 0-5.128-.958-7.07-2.898-1.974-1.956-2.948-4.305-2.948-7.061 0-2.735.977-5.068 2.948-7.024 1.942-1.947 4.309-2.914 7.07-2.914" />
									<path d="M155.243 23.782c-2.912 0-5.416-1.029-7.449-3.062-2.058-2.035-3.092-4.528-3.092-7.418 0-2.869 1.034-5.356 3.092-7.388 2.047-2.044 4.554-3.088 7.449-3.088 2.838 0 5.332 1.038 7.391 3.069 2.062 2.035 3.093 4.521 3.093 7.406 0 2.875-1.025 5.362-3.078 7.395-2.042 2.049-4.542 3.086-7.406 3.086m0-19.899c-2.601 0-4.856.929-6.703 2.774-1.875 1.862-2.795 4.031-2.795 6.643 0 2.632.92 4.815 2.795 6.67 1.823 1.825 4.09 2.759 6.703 2.759 2.61 0 4.797-.904 6.661-2.775 1.837-1.838 2.771-4.067 2.771-6.654 0-2.586-.941-4.833-2.785-6.663-1.85-1.831-4.092-2.754-6.647-2.754" />
									<path d="M155.206 22.154c-2.42 0-4.526-.874-6.267-2.603-1.723-1.724-2.598-3.828-2.598-6.251.021-2.442.898-4.537 2.613-6.245 1.707-1.704 3.809-2.578 6.25-2.578 2.418 0 4.525.874 6.262 2.592 1.736 1.708 2.611 3.813 2.611 6.23-.014 2.43-.898 4.534-2.635 6.266-1.712 1.724-3.818 2.589-6.236 2.589m0-16.624c-2.147 0-3.996.771-5.498 2.275-1.543 1.528-2.283 3.32-2.301 5.501 0 2.129.766 3.983 2.282 5.496 1.549 1.543 3.354 2.299 5.517 2.299 2.164 0 3.955-.75 5.498-2.29 1.541-1.538 2.299-3.345 2.323-5.52 0-2.151-.762-3.943-2.299-5.478-1.533-1.512-3.393-2.283-5.522-2.283" />
									<path d="M160.835 19.338h-3.392l-.151-.273c-1.826-3.312-2.379-3.857-2.476-3.933-.301-.212-.707-.336-1.209-.336h-.51v4.542h-2.791V7.596h4.252c1.213 0 2.068.084 2.697.254.707.183 1.301.58 1.75 1.195.439.598.66 1.261.66 1.962 0 .874-.318 1.663-.943 2.348-.356.412-.812.716-1.358.925.502.485 1.041 1.201 1.651 2.175l1.82 2.883zm-2.773-1.052h.853l-.801-1.27c-1.302-2.102-1.99-2.409-2.162-2.445l-.283-.062c.513.551 1.304 1.815 2.393 3.777m-6.703 0h.687v-4.543h1.563c.721 0 1.352.188 1.848.556a.623.623 0 0 1 .086.068v-.803l.486-.085c.854-.063 1.477-.336 1.906-.828.465-.506.684-1.034.684-1.644 0-.466-.16-.928-.465-1.34s-.689-.67-1.168-.785c-.539-.164-1.322-.233-2.426-.233h-3.199v9.637h-.002z" />
									<path d="M154.693 13.315h-2.645V9.037h2.514c1.213 0 2.025.179 2.498.545.494.382.75.935.75 1.584 0 .685-.264 1.231-.772 1.62-.502.365-1.27.529-2.345.529m-1.589-1.051h1.592c1.043 0 1.514-.188 1.723-.337.229-.179.344-.412.344-.761a.945.945 0 0 0-.344-.759c-.1-.069-.52-.317-1.854-.317h-1.461v2.174z" />
								</svg>
								<p className="text-white max-sm:text-sm">
									Alla produkterna är FSC®-certifierade,
									vilket innebär att vi tar ansvar både
									miljömässigt och för hela vår process enligt
									de krav som ställs för att erhålla
									certifieringen.
								</p>
							</div>
							<div className="lg:ml-8 flex gap-8 items-center">
								<LuRecycle className="text-white text-8xl" />
								<p className="text-white max-sm:text-sm">
									Våra brickor är helt återvinningsbara och
									producerade i Sverige med enbart
									närproducerade material.
								</p>
							</div>
							<div className="flex gap-8 items-center">
								<PiForkKnifeFill className="text-white text-9xl" />
								<p className="text-white max-sm:text-sm">
									Våra brickor är godkända för livsmedel. Så
									du kan känna dig trygg med att brickan inte
									släpper ifrån sig ämnen som påverkar ditt
									livsmedel.
								</p>
							</div>
							<div className="lg:ml-8 flex gap-8 items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="#fff"
									height="120px"
									width="120px"
									viewBox="0 0 59 59"
								>
									<g>
										<path d="M56.5,0h-54c-0.553,0-1,0.447-1,1v10v47c0,0.553,0.447,1,1,1h54c0.553,0,1-0.447,1-1V11V1C57.5,0.447,57.053,0,56.5,0z    M3.5,2h52v8h-52V2z M3.5,57V12h52v45H3.5z" />
										<path d="M10.5,3h-4c-0.553,0-1,0.447-1,1v4c0,0.553,0.447,1,1,1h4c0.553,0,1-0.447,1-1V4C11.5,3.447,11.053,3,10.5,3z M9.5,7h-2V5   h2V7z" />
										<path d="M17.5,3h-4c-0.553,0-1,0.447-1,1v4c0,0.553,0.447,1,1,1h4c0.553,0,1-0.447,1-1V4C18.5,3.447,18.053,3,17.5,3z M16.5,7h-2V5   h2V7z" />
										<path d="M53.5,3h-24c-0.553,0-1,0.447-1,1v4c0,0.553,0.447,1,1,1h24c0.553,0,1-0.447,1-1V4C54.5,3.447,54.053,3,53.5,3z M52.5,7   h-22V5h22V7z" />
										<path d="M51.5,17h-44c-0.553,0-1,0.447-1,1v20.102v4.659V53c0,0.553,0.447,1,1,1h11.918h4.365h4.635h4.365h4.635h4.365h4.635h4.365   H51.5c0.553,0,1-0.447,1-1V18C52.5,17.447,52.053,17,51.5,17z M50.5,19v13h-2v-4c0-1.859-1.279-3.411-3-3.858V22h1   c0.553,0,1-0.447,1-1s-0.447-1-1-1h-4c-0.553,0-1,0.447-1,1s0.447,1,1,1h1v2.142c-1.721,0.447-3,1.999-3,3.858v4h-2v-4   c0-1.859-1.279-3.411-3-3.858V22h1c0.553,0,1-0.447,1-1s-0.447-1-1-1h-4c-0.553,0-1,0.447-1,1s0.447,1,1,1h1v2.142   c-1.721,0.447-3,1.999-3,3.858v4h-2v-4c0-1.859-1.279-3.411-3-3.858V22h1c0.553,0,1-0.447,1-1s-0.447-1-1-1h-4   c-0.553,0-1,0.447-1,1s0.447,1,1,1h1v2.142c-1.721,0.447-3,1.999-3,3.858v4h-2v-4c0-1.859-1.279-3.411-3-3.858V22h1   c0.553,0,1-0.447,1-1s-0.447-1-1-1h-4c-0.553,0-1,0.447-1,1s0.447,1,1,1h1v2.142c-1.721,0.447-3,1.999-3,3.858v4h-2V19H50.5z    M44.5,26c1.103,0,2,0.897,2,2v4h-4v-4C42.5,26.897,43.397,26,44.5,26z M34.5,26c1.103,0,2,0.897,2,2v4h-4v-4   C32.5,26.897,33.397,26,34.5,26z M24.5,26c1.103,0,2,0.897,2,2v4h-4v-4C22.5,26.897,23.397,26,24.5,26z M14.5,26   c1.103,0,2,0.897,2,2v4h-4v-4C12.5,26.897,13.397,26,14.5,26z M16.682,38.831c0.124,0.051,0.244,0.11,0.365,0.165   c0.182,0.083,0.364,0.168,0.541,0.261c0.102,0.053,0.202,0.109,0.302,0.165c0.225,0.127,0.446,0.26,0.661,0.402   c0.043,0.028,0.087,0.055,0.13,0.084c0.758,0.517,1.441,1.132,2.047,1.817c0.189,0.213,0.368,0.433,0.538,0.658   c0.036,0.047,0.071,0.094,0.106,0.142c0.163,0.223,0.317,0.451,0.462,0.684c0.036,0.059,0.072,0.118,0.108,0.177   c0.135,0.227,0.263,0.457,0.381,0.692c0.037,0.074,0.073,0.15,0.109,0.225c0.107,0.226,0.208,0.453,0.3,0.685   c0.038,0.096,0.071,0.193,0.106,0.29c0.079,0.218,0.154,0.437,0.219,0.659c0.037,0.126,0.066,0.254,0.098,0.382   c0.05,0.199,0.101,0.397,0.14,0.599c0.001,0.003,0.001,0.006,0.002,0.009c0.034,0.176,0.056,0.355,0.082,0.533   c0.018,0.127,0.039,0.253,0.053,0.381c0.005,0.048,0.012,0.095,0.016,0.143C23.479,48.32,23.5,48.657,23.5,49   c0,0.443-0.04,0.891-0.099,1.339c-0.012,0.089-0.022,0.179-0.036,0.268c-0.069,0.433-0.163,0.867-0.287,1.301   c-0.009,0.031-0.02,0.061-0.029,0.092h-2.088c0.344-0.962,0.539-1.974,0.539-3c0-4.963-4.037-9-9-9c-1.413,0-2.767,0.328-4,0.945   v-2.183C9.784,38.256,11.127,38,12.5,38C13.981,38,15.392,38.298,16.682,38.831z M19.75,38.215   c-0.025-0.017-0.047-0.038-0.073-0.055C20.282,38.054,20.891,38,21.5,38c1.481,0,2.892,0.298,4.182,0.831   c0.124,0.051,0.244,0.11,0.365,0.165c0.182,0.083,0.364,0.168,0.541,0.261c0.102,0.053,0.202,0.109,0.302,0.165   c0.225,0.127,0.446,0.26,0.661,0.402c0.043,0.028,0.087,0.055,0.13,0.084c0.758,0.517,1.441,1.132,2.047,1.817   c0.189,0.213,0.368,0.433,0.538,0.658c0.036,0.047,0.071,0.094,0.106,0.142c0.163,0.223,0.317,0.451,0.462,0.684   c0.036,0.059,0.072,0.118,0.108,0.177c0.135,0.227,0.263,0.457,0.381,0.692c0.037,0.074,0.073,0.15,0.109,0.225   c0.107,0.226,0.208,0.453,0.3,0.685c0.038,0.096,0.071,0.193,0.106,0.29c0.079,0.218,0.154,0.437,0.219,0.659   c0.037,0.126,0.066,0.254,0.098,0.382c0.05,0.199,0.101,0.397,0.14,0.599c0.001,0.003,0.001,0.006,0.002,0.009   c0.034,0.176,0.056,0.355,0.082,0.533c0.018,0.127,0.039,0.253,0.053,0.381c0.005,0.048,0.012,0.095,0.016,0.143   C32.479,48.32,32.5,48.657,32.5,49c0,0.443-0.04,0.891-0.099,1.339c-0.012,0.089-0.022,0.179-0.036,0.268   c-0.069,0.433-0.163,0.867-0.287,1.301c-0.009,0.031-0.02,0.061-0.029,0.092h-2.088c0.344-0.962,0.539-1.974,0.539-3   c0-4.833-3.831-8.776-8.614-8.98c-0.025-0.026-0.052-0.049-0.077-0.075c-0.131-0.135-0.268-0.262-0.405-0.391   c-0.198-0.186-0.393-0.375-0.603-0.549C20.464,38.725,20.114,38.46,19.75,38.215z M28.75,38.215   c-0.025-0.017-0.047-0.038-0.073-0.055C29.282,38.054,29.891,38,30.5,38c1.481,0,2.892,0.298,4.182,0.831   c0.124,0.051,0.244,0.11,0.365,0.165c0.182,0.083,0.364,0.168,0.541,0.261c0.102,0.053,0.202,0.109,0.302,0.165   c0.225,0.127,0.446,0.26,0.661,0.402c0.043,0.028,0.087,0.055,0.13,0.084c0.758,0.517,1.441,1.132,2.047,1.817   c0.189,0.213,0.368,0.433,0.538,0.658c0.036,0.047,0.071,0.094,0.106,0.142c0.163,0.223,0.317,0.451,0.462,0.684   c0.036,0.059,0.072,0.118,0.108,0.177c0.135,0.227,0.263,0.457,0.381,0.692c0.037,0.074,0.073,0.15,0.109,0.225   c0.107,0.226,0.208,0.453,0.3,0.685c0.038,0.096,0.071,0.193,0.106,0.29c0.079,0.218,0.154,0.437,0.219,0.659   c0.037,0.126,0.066,0.254,0.098,0.382c0.05,0.199,0.101,0.397,0.14,0.599c0.001,0.003,0.001,0.006,0.002,0.009   c0.034,0.176,0.056,0.355,0.082,0.533c0.018,0.127,0.039,0.253,0.053,0.381c0.005,0.048,0.012,0.095,0.016,0.143   C41.479,48.32,41.5,48.657,41.5,49c0,0.443-0.04,0.891-0.099,1.339c-0.012,0.089-0.022,0.179-0.036,0.268   c-0.069,0.433-0.163,0.867-0.287,1.301c-0.009,0.031-0.02,0.061-0.029,0.092h-2.088c0.344-0.962,0.539-1.974,0.539-3   c0-4.833-3.831-8.776-8.614-8.98c-0.025-0.026-0.052-0.049-0.077-0.075c-0.131-0.135-0.268-0.262-0.405-0.391   c-0.198-0.186-0.393-0.375-0.603-0.549C29.464,38.725,29.114,38.46,28.75,38.215z M8.5,52v-8.74c1.177-0.826,2.551-1.26,4-1.26   c3.859,0,7,3.141,7,7c0,1.038-0.234,2.064-0.683,3H8.5z M25.128,52c0.018-0.073,0.024-0.147,0.041-0.221   c0.081-0.354,0.147-0.708,0.197-1.062c0.018-0.125,0.036-0.251,0.05-0.376C25.466,49.893,25.5,49.446,25.5,49   c0-0.39-0.024-0.777-0.059-1.163c-0.01-0.111-0.021-0.222-0.034-0.333l-0.001-0.007c-0.008-0.067-0.012-0.135-0.021-0.203   c-0.033-0.25-0.077-0.498-0.125-0.745c-0.024-0.124-0.05-0.246-0.077-0.368c-0.012-0.054-0.027-0.109-0.039-0.163   c-0.033-0.139-0.064-0.279-0.101-0.416c-0.022-0.081-0.047-0.16-0.071-0.24c-0.046-0.158-0.096-0.315-0.148-0.471   c-0.039-0.115-0.078-0.229-0.12-0.343c-0.061-0.168-0.122-0.336-0.19-0.501c-0.067-0.161-0.144-0.315-0.216-0.473   c-0.073-0.158-0.143-0.317-0.222-0.472c-0.12-0.236-0.25-0.464-0.384-0.691c-0.014-0.024-0.026-0.049-0.04-0.073   C26.462,43.248,28.5,45.891,28.5,49c0,1.038-0.234,2.064-0.683,3H25.128z M34.128,52c0.018-0.073,0.024-0.147,0.041-0.221   c0.081-0.354,0.147-0.708,0.197-1.062c0.018-0.125,0.036-0.251,0.05-0.376C34.466,49.893,34.5,49.446,34.5,49   c0-0.39-0.024-0.777-0.059-1.163c-0.01-0.111-0.021-0.222-0.034-0.333l-0.001-0.007c-0.008-0.067-0.012-0.135-0.021-0.203   c-0.033-0.25-0.077-0.498-0.125-0.745c-0.024-0.124-0.05-0.246-0.077-0.368c-0.012-0.054-0.027-0.109-0.039-0.163   c-0.033-0.139-0.064-0.279-0.101-0.416c-0.022-0.081-0.047-0.16-0.071-0.24c-0.046-0.158-0.096-0.315-0.148-0.471   c-0.039-0.115-0.078-0.229-0.12-0.343c-0.061-0.168-0.122-0.336-0.19-0.501c-0.067-0.161-0.144-0.315-0.216-0.473   c-0.073-0.158-0.143-0.317-0.222-0.472c-0.12-0.236-0.25-0.464-0.384-0.691c-0.014-0.024-0.026-0.049-0.04-0.073   C35.462,43.248,37.5,45.891,37.5,49c0,1.038-0.234,2.064-0.683,3H34.128z M43.128,52c0.018-0.073,0.024-0.147,0.041-0.221   c0.081-0.354,0.147-0.708,0.197-1.062c0.018-0.125,0.036-0.251,0.05-0.376C43.466,49.893,43.5,49.446,43.5,49   c0-0.39-0.024-0.777-0.059-1.163c-0.01-0.111-0.021-0.222-0.034-0.333l-0.001-0.007c-0.008-0.067-0.012-0.135-0.021-0.203   c-0.033-0.25-0.077-0.498-0.125-0.745c-0.024-0.124-0.05-0.246-0.077-0.368c-0.012-0.054-0.027-0.109-0.039-0.163   c-0.033-0.139-0.064-0.279-0.101-0.416c-0.022-0.081-0.047-0.16-0.071-0.24c-0.046-0.158-0.096-0.315-0.148-0.471   c-0.039-0.115-0.078-0.229-0.12-0.343c-0.061-0.168-0.122-0.336-0.19-0.501c-0.067-0.161-0.144-0.315-0.216-0.473   c-0.073-0.158-0.143-0.317-0.222-0.472c-0.12-0.236-0.25-0.464-0.384-0.691c-0.014-0.024-0.026-0.049-0.04-0.073   C44.462,43.248,46.5,45.891,46.5,49c0,1.038-0.234,2.064-0.683,3H43.128z M50.058,52h-2.097c0.344-0.962,0.539-1.974,0.539-3   c0-4.833-3.831-8.776-8.614-8.98c-0.025-0.026-0.052-0.049-0.077-0.075c-0.131-0.135-0.268-0.262-0.405-0.391   c-0.198-0.186-0.393-0.375-0.603-0.549c-0.337-0.28-0.687-0.545-1.051-0.79c-0.025-0.017-0.047-0.038-0.073-0.055   C38.282,38.054,38.891,38,39.5,38c6.065,0,11,4.935,11,11C50.5,49.99,50.352,50.996,50.058,52z M39.5,36   c-1.507,0-3.008,0.288-4.469,0.831C33.617,36.303,32.095,36,30.5,36c-1.507,0-3.008,0.288-4.469,0.831   C24.617,36.303,23.095,36,21.5,36c-1.507,0-3.008,0.288-4.469,0.831C15.617,36.303,14.095,36,12.5,36c-1.367,0-2.706,0.219-4,0.643   V34h3h6h4h6h4h6h4h6h3v8.104C48.197,38.445,44.133,36,39.5,36z" />
									</g>
								</svg>
								<p className="text-white max-sm:text-sm">
									Våra brickor går utmärkt att diska i
									diskmaskin. Även om brickan är tillverkad av
									björkfaner så är brickan tillverkad så att
									den blir mycket kompakt och därmed
									vattenresistent.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
