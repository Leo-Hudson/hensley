import { NextResponse } from "next/server";
import { createWixClientCart, logError } from "@/utils";
import handleAuthentication from "@/services/auth/handleAuthentication";

export const POST = async (req) => {
  try {
    const authenticatedUserData = await handleAuthentication(req);
    if (!authenticatedUserData) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const { memberTokens, id, productData } = body;

    const cartClient = await createWixClientCart(memberTokens);
    await cartClient.currentCart.removeLineItemsFromCurrentCart([id]);
    await cartClient.currentCart.addToCurrentCart(productData);

    return NextResponse.json(
      { message: "Cart item updated Successfully" },
      { status: 200 }
    );
  } catch (error) {
    logError(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
