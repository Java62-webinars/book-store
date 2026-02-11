import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import {calculateOrderSummary, createOrder} from "../order.js";

describe("Order Entity Tests", () => {
    describe("calculateOrderSummary (items)", () => {
        it("should calculate order summary, linetotal ", () => {
            const inputItems = [
                {
                    isbn: "111",
                    title: "A",
                    priceAtPurchase: 10,
                    qty: 2
                },
                {
                    isbn: "222",
                    title: "B",
                    priceAtPurchase: 5,
                    qty: 3
                }
            ];
            const {items, summary} = calculateOrderSummary(inputItems);
            expect(items).toHaveLength(2);
            expect(items[0].lineTotal).toBe(20);
            expect(items[1].lineTotal).toBe(15);
            expect(summary.subtotal).toBe(35);
        })

        it("should ignore invalid linetotal (NaN does break total)", () => {
            const inputItems = [
                {
                    isbn: "111",
                    title: "A",
                    priceAtPurchase: 10,
                    qty: 2
                },
                {
                    isbn: "222",
                    title: "B",
                    priceAtPurchase: "oops",
                    qty: 3
                }
            ];
            const {items, summary} = calculateOrderSummary(inputItems);
            expect(items).toHaveLength(2);
            expect(items[0].lineTotal).toBe(20);
            console.log(items[1].lineTotal);
            expect(summary.subtotal).toBe(20);
        })
    })
    describe("createOrder ({buyer, items})", () => {
        beforeEach(() => {
            vi.spyOn(Date, "now").mockReturnValue(999999);
        });
        afterEach(() => {
            vi.restoreAllMocks();
        });
        it("creates a valid order and returns an ok===true", () => {
            const buyer = {name: "Mr X", contact: "mrX@gmail.com"};
            const items = [
                {
                    isbn: "111",
                    title: "A",
                    priceAtPurchase: 10,
                    qty: 2
                },
                {
                    isbn: "222",
                    title: "B",
                    priceAtPurchase: 5,
                    qty: 3
                }
            ];
            const result = createOrder({buyer, items});
            expect(result.ok).toBe(true);
            const {order} = result;
            expect(order.createdAt).toBe(999999);
            expect(order.id).toContain("_999999");
            console.log(Date.now());
        })
    })
    describe("Date(now) works", () => {
        it("Date(now) ", () => {
            console.log(Date.now().toString());
        })
    })
})