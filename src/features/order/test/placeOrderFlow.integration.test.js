import {describe, expect, it} from "vitest";
import {buildOrderDraftFromCart} from "../buildOrderDraftFromCart.js";
import {createOrder} from "../../../entities/order/order.js";

describe("Order placement flow (integration, soft mode)", () => {
    it("creates order only from valid items and keeps excluded for warning", () => {
        const cartItems = [
            {isbn: "A", quantity: 2},
            {isbn: "B", quantity: 1},
        ];

        const catalog = [
            {isbn: "A", title: "Alpha", price: 10, flagOutOfStock: false},
            {isbn: "B", title: "Beta", price: 7, flagOutOfStock: true},
        ];

        const buyer = {name: "John", contact: "john@example.com"};

        const draft = buildOrderDraftFromCart(cartItems, catalog);

        expect(draft.items).toHaveLength(1);
        expect(draft.excluded).toHaveLength(1);
        expect(draft.excluded[0].reason).toBe("OUT_OF_STOCK");

        const res = createOrder({buyer, items: draft.items});

        expect(res.ok).toBe(true);
        expect(res.ok && res.order.items).toHaveLength(1);
        expect(res.ok && res.order.items[0].isbn).toBe("A");

        expect(res.ok && res.order.summary.subtotal).toBe(20);
        expect(res.ok && res.order.summary.total).toBe(20);
    });

    it("does not create order when all items are excluded (no valid items)", () => {
        const cartItems = [{isbn: "B", quantity: 1}];
        const catalog = [{isbn: "B", title: "Beta", price: 7, flagOutOfStock: true}];
        const buyer = {name: "John", contact: "john@example.com"};

        const draft = buildOrderDraftFromCart(cartItems, catalog);
        expect(draft.items).toEqual([]);
        expect(draft.excluded).toHaveLength(1);

        const res = createOrder({buyer, items: draft.items});

        expect(res.ok).toBe(false);
        expect(res.ok === false && res.errors).toContain("Order must contain at least one item.");
    });

    it("does not create order when buyer is invalid even if items valid", () => {
        const cartItems = [{isbn: "A", quantity: 1}];
        const catalog = [{isbn: "A", title: "Alpha", price: 10, flagOutOfStock: false}];

        const draft = buildOrderDraftFromCart(cartItems, catalog);
        const res = createOrder({buyer: {name: "", contact: ""}, items: draft.items});

        expect(res.ok).toBe(false);
        expect(res.ok === false && res.errors).toContain("Buyer name is required.");
        expect(res.ok === false && res.errors).toContain("Buyer contact is required.");
    });
});
