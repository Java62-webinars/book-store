import {describe, expect, it, vi} from "vitest";
import {addItemToCart} from "../addItemToCart.js";
import {addItem, clearCartMessages, setCartError} from "../cartSlice.js";

function makeStateWithCatalogBooks(items) {
    return {
        catalog: {items},
        cart: {cartItems: [], info: null, error: null},
    }
}

describe("addItemToCart thunk", () => {
    it("dispaches clearCartMessages first", () => {
        const dispatch = vi.fn();
        const getState = () => makeStateWithCatalogBooks([{isbn: "978978978978", flagOutOfStock: false}]);
        addItemToCart("978978978978")(dispatch, getState);
        expect(dispatch.mock.calls[0][0]).toEqual(clearCartMessages());
    })

    it("sets error when isbn is null / undefined", () => {
        const dispatch = vi.fn();
        const getState = () => makeStateWithCatalogBooks([]);
        addItemToCart([])(dispatch, getState);
        expect(dispatch).toHaveBeenCalledWith(clearCartMessages());
        expect(dispatch).toHaveBeenCalledWith(setCartError("ISBN is required"));
        expect(dispatch).not.toHaveBeenCalledWith(addItem(expect.anything()));
    })

    it("sets error when book is out of stock", () => {
        const dispatch = vi.fn();
        const getState = () => makeStateWithCatalogBooks([{isbn: "978978978978", flagOutOfStock: true}]);
        addItemToCart("978978978978")(dispatch, getState);
        expect(dispatch).toHaveBeenCalledWith(clearCartMessages());
        expect(dispatch).toHaveBeenCalledWith(setCartError("Book is out of stock"));
        expect(dispatch).not.toHaveBeenCalledWith(addItem(expect.anything()));
    })

    it("dispaches addItem when book exists and in stock", () => {
        const dispatch = vi.fn();
        const getState = () => makeStateWithCatalogBooks([
            {isbn: "978978978978", flagOutOfStock: false},
            {isbn: "978978978979", flagOutOfStock: false}
        ]);
        addItemToCart("978978978978")(dispatch, getState);
        expect(dispatch).toHaveBeenCalledWith(addItem("978978978978"));
        expect(dispatch).not.toHaveBeenCalledWith(setCartError(expect.anything()));
    })
})

