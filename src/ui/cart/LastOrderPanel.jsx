import {useSelector} from "react-redux";

function LastOrderPanel() {
    const lastOrder = useSelector((s) => s.order?.lastOrder ?? null);
    const excluded = useSelector((s) => s.order?.excluded ?? []);

    return (
        <section className="pt-4 border-t">
            <h3 className="text-base font-semibold">Last order</h3>

            {!lastOrder ? (
                <div className="mt-2 text-sm text-gray-600">No orders yet</div>
            ) : (
                <div className="mt-2 text-sm text-gray-800 space-y-2">
                    <div>
                        <b>Status:</b> {String(lastOrder.status ?? "placed")}
                    </div>

                    <div>
                        <b>Buyer:</b>{" "}
                        {String(lastOrder.buyer?.name ?? "")}{" "}
                        {lastOrder.buyer?.contact
                            ? `(${String(lastOrder.buyer.contact)})`
                            : ""}
                    </div>

                    <div>
                        <b>Items:</b>{" "}
                        {Array.isArray(lastOrder.items) ? lastOrder.items.length : 0}
                    </div>

                    <div>
                        <b>Total:</b>{" "}
                        {lastOrder.summary?.total != null ? `$${lastOrder.summary.total}` : "—"}
                    </div>

                    {Array.isArray(excluded) && excluded.length > 0 ? (
                        <div className="mt-2">
                            <div className="font-semibold text-amber-900">
                                Excluded positions ({excluded.length})
                            </div>
                            <ul className="list-disc pl-5 mt-1 space-y-1">
                                {excluded.map((x, idx) => (
                                    <li key={idx}>
                                        {x?.cartItem?.isbn ?? x?.isbn ?? "Unknown ISBN"}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : null}
                </div>
            )}
        </section>
    );
}

export default LastOrderPanel;