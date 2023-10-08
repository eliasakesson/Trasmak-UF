export default function Success() {
	return (
		<div className={`flex justify-center py-32`}>
			<div className="w-1/2 max-w-3xl bg-white rounded-xl p-8">
				<div className="flex flex-col items-center gap-2  pb-8">
					<svg
						className="w-12 h-12 fill-green-400 mb-2"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
							clip-rule="evenodd"></path>
					</svg>
					<h1 className="font-bold text-2xl">
						We received your order!
					</h1>
					<p className="text-base text-muted">
						Your order #2939993 is completed and ready to ship
					</p>
				</div>
				<div className="border-y border-border py-8">
					<div className="grid grid-cols-2 gap-16">
						<div className="space-y-2">
							<h2 className="text-muted_light font-semibold mb-6">
								Shipping Address
							</h2>
							<p className="gc cn mn ao">Wilson Baker</p>
							<p className="kc cn mn ao">
								4517 Washington Ave. Manchester, Kentucky 39495,
								USA
							</p>
						</div>
						<div className="space-y-2">
							<h2 className="text-muted_light font-semibold mb-6">
								Payment Info
							</h2>
							<p className="gc cn mn ao">Credit Card</p>
							<p className="dc cn mn ao">
								VISA
								<br />
								**** 4660
							</p>
						</div>
					</div>
				</div>

				<div className="wl">
					<h2 className="fn nn tn zn pn">Order Items</h2>

					<div className="td mc">
						<ul className="ji li zb">
							<li className="rd lg sg sh ll lv">
								<div className="rd og">
									<div className="uf">
										<img
											className="al se ie ti"
											src="https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/order-confirmation/3/product-1.png"
											alt=""
										/>
									</div>

									<div className="rd hg sg ic hf">
										<p className="sf cn nn xn">
											Apple Watch Series 7 - 44mm
										</p>
										<p className="jc cn mn yn">Golden</p>
									</div>
								</div>

								<div className="rc">
									<p className="cn nn an xn">$259.00</p>
								</div>
							</li>

							<li className="rd lg sg sh ll lv">
								<div className="rd og">
									<div className="uf">
										<img
											className="al se ie ti"
											src="https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/order-confirmation/3/product-2.png"
											alt=""
										/>
									</div>

									<div className="rd hg sg ic hf">
										<p className="sf cn nn xn">
											Beylob 90 Speaker
										</p>
										<p className="jc cn mn yn">
											Space Gray
										</p>
									</div>
								</div>

								<div className="rc">
									<p className="cn nn an xn">$99.00</p>
								</div>
							</li>

							<li className="rd lg sg sh ll lv">
								<div className="rd og">
									<div className="uf">
										<img
											className="al se ie ti"
											src="https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/order-confirmation/3/product-3.png"
											alt=""
										/>
									</div>

									<div className="rd hg sg ic hf">
										<p className="sf cn nn xn">
											Beoplay M5 Bluetooth Speaker
										</p>
										<p className="jc cn mn yn">
											Silver Collection
										</p>
									</div>
								</div>

								<div className="rc">
									<p className="cn nn an xn">$129.00</p>
								</div>
							</li>
						</ul>
					</div>
				</div>

				<div className="wl">
					<ul className="qh">
						<li className="rd ng sg">
							<p className="cn mn ao">Sub total</p>
							<p className="cn mn ao">$699</p>
						</li>

						<li className="rd ng sg">
							<p className="cn mn xn">Total</p>
							<p className="cn nn xn">$699</p>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
