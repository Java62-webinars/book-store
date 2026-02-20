import {describe, expect, it} from "vitest";
import {buildOrderDraftFromCart} from "../buildOrderDraftFromCart.js";

describe("buildOrderDraftFromCart (unit)", () => {
    it("excludes MISSING items and returns empty items when nothing valid", () => {
        const cartItems = [{isbn: "X", quantity: 2}];
        const catalog = [{isbn: "A", title: "Alpha", price: 10, flagOutOfStock: false}];

        const res = buildOrderDraftFromCart(cartItems, catalog);

        expect(res.items).toEqual([]);
        expect(res.excluded).toHaveLength(1);
        expect(res.excluded[0].reason).toBe("MISSING");
        expect(res.excluded[0].book).toBe(null);
        expect(res.excluded[0].cartItem).toEqual({isbn: "X", quantity: 2});
    });

    it("excludes OUT_OF_STOCK items", () => {
        const cartItems = [{isbn: "A", quantity: 1}];
        const catalog = [{isbn: "A", title: "Alpha", price: 10, flagOutOfStock: true}];

        const res = buildOrderDraftFromCart(cartItems, catalog);

        expect(res.items).toEqual([]);
        expect(res.excluded).toHaveLength(1);
        expect(res.excluded[0].reason).toBe("OUT_OF_STOCK");
        expect(res.excluded[0].book?.isbn).toBe("A");
    });

    it("maps only valid items into OrderItem[] with lineTotal", () => {
        const cartItems = [
            {isbn: "A", quantity: 2},
            {isbn: "B", quantity: 3},
            {isbn: "C", quantity: 1},
        ];

        const catalog = [
            {isbn: "A", title: "Alpha", price: 10, flagOutOfStock: false},
            {isbn: "B", title: "Beta", price: 5, flagOutOfStock: true},
        ];

        const res = buildOrderDraftFromCart(cartItems, catalog);

        expect(res.items).toHaveLength(1);
        expect(res.items[0]).toEqual({
            isbn: "A",
            title: "Alpha",
            priceAtPurchase: 10,
            qty: 2,
            lineTotal: 20,
        });

        expect(res.excluded).toHaveLength(2);
        expect(res.excluded.map((x) => x.reason).sort()).toEqual(["MISSING", "OUT_OF_STOCK"]);
    });
});
