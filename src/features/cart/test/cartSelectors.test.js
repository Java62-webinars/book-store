import {describe, expect, it} from "vitest";
import {
    selectCartInvalidCount,
    selectCartInvalidLines,
    selectCartState,
    selectCartTotalBooks,
    selectCartTotalsSafe,
    selectCartUniqueISBN,
} from "../cartSelectors.js";

describe("cartSelectors", () => {
    it("selectCartState should return cart ", () => {
        const state = {
            cart: {
                cartItems: [],
                info: null,
                error: null,
            },
        };
        expect(selectCartState(state)).toEqual(state.cart);
    });

    it("selectCartUniqueISBN should return count of uniq ISBN", () => {
        const state = {
            cart: {
                cartItems: [
                    {isbn: 1, quantity: 1},
                    {isbn: 2, quantity: 3},
                    {isbn: 3, quantity: 1},
                ],
                info: null,
                error: null,
            }
        }
        expect(selectCartUniqueISBN(state)).toBe(3);
    });

    it("selectCartTotalBooks should return count of total books", () => {
        const state = {
            cart: {
                cartItems: [
                    {isbn: 1, quantity: 1},
                    {isbn: 2, quantity: 3},
                    {isbn: 3, quantity: 1},
                ],
                info: null,
                error: null,
            }
        }
        expect(selectCartTotalBooks(state)).toBe(5);
    });

    it("consistency: invalid lines are detected (missing book / out of stock)", () => {
        const state = {
            catalog: {
                items: [
                    {isbn: "111", title: "B1", author: "A1", price: 10, flagOutOfStock: false},
                    {isbn: "222", title: "B2", author: "A2", price: 5, flagOutOfStock: true},
                ],
            },
            cart: {
                cartItems: [
                    {isbn: "111", quantity: 2}, // ok
                    {isbn: "222", quantity: 1}, // out of stock
                    {isbn: "333", quantity: 1}, // missing
                ],
                info: null,
                error: null,
            },
        };

        expect(selectCartInvalidCount(state)).toBe(2);
        expect(selectCartInvalidLines(state)).toEqual([
            {isbn: "222", quantity: 1, reason: "OUT_OF_STOCK"},
            {isbn: "333", quantity: 1, reason: "MISSING"},
        ]);
    });

    it("consistency: totalsSafe counts only valid lines", () => {
        const state = {
            catalog: {
                items: [
                    {isbn: "111", title: "B1", author: "A1", price: 10, flagOutOfStock: false},
                    {isbn: "222", title: "B2", author: "A2", price: 5, flagOutOfStock: true},
                ],
            },
            cart: {
                cartItems: [
                    {isbn: "111", quantity: 2}, // ok => 20
                    {isbn: "222", quantity: 3}, // out of stock => ignore in safe totals
                    {isbn: "333", quantity: 1}, // missing => ignore in safe totals
                ],
                info: null,
                error: null,
            },
        };

        expect(selectCartTotalsSafe(state)).toEqual({
            totalBooks: 2,
            subtotal: 20,
            invalidCount: 2,
        });
    });
});
