---
title: Klaviyo abandoned cart flow filter: stop emailing people who already paid
seo_title: Klaviyo abandoned cart flow filter: stop emailing buyers
description: Why a Klaviyo abandoned cart flow emails customers who already paid, the one flow filter that stops it, and how to test it with a real checkout.
date: 2026-11-06
slug: klaviyo-abandoned-cart-flow-filter
service: /shopify-expert/
service_label: Shopify developer, Klaviyo and tracking
tags: klaviyo, abandoned cart, shopify
target: klaviyo abandoned cart flow filter
---
A Klaviyo abandoned cart flow filter decides who keeps getting the emails. Without the filter "Placed Order zero times since starting this flow", a customer who pays during the wait still gets "You left something in your cart". Add that filter, then prove it works with one real test checkout.

I built and tested this on a Shopify demo store. Below is the setup, the test, what it does and doesn't prove, and when you can leave things alone.

## Why does the abandoned cart email reach people who already paid?

The flow starts when someone begins checkout. Then it waits. Klaviyo's pre-built abandoned cart flows [wait 4 hours before the first message](https://help.klaviyo.com/hc/en-us/articles/115002779411).

Anyone who completes the purchase during that wait is still in the flow. Unless something checks for an order, the timer runs out and the email goes. For example, with the 4-hour default, that customer could see:

- 10:42 · "Order #1001 confirmed"
- 14:42 · "You left something in your cart"

The second email tells a paying customer your store doesn't know they paid.

## What is the Klaviyo abandoned cart flow filter?

It's a profile filter on the flow: a rule about what the person has done. Klaviyo's help page tells you to [check for "Person has Placed Order zero times since starting this flow"](https://help.klaviyo.com/hc/en-us/articles/115002779411).

The key words are "since starting this flow". They mean "bought after this checkout began", not "has ever bought". A loyal customer who abandons a second cart still gets the reminder. Someone who abandons and then pays does not.

## Why a profile filter and not a trigger filter?

Klaviyo has two kinds of filter, and they're checked at different times.

- **Trigger filters** look at the event that started the flow, such as the checkout's value. Klaviyo says [metric-based trigger filters are only checked when someone first enters the flow](https://help.klaviyo.com/hc/en-us/articles/115002779051). A purchase that happens later can't affect them.
- **Profile filters** look at the person. Klaviyo [checks them when people enter the flow and again before flow actions](https://help.klaviyo.com/hc/en-us/articles/115002779051). If the check fails, that action is skipped.

So the purchase check has to be a profile filter. A trigger filter can't stop an email for someone who paid during the wait.

## How do you add it?

In Klaviyo:

1. Open the abandoned cart flow and click the trigger at the top.
2. Add it under **Profile filters**, not Trigger filters. In my account, the trigger card then shows a "Profile filters" tag.
3. Set the condition to **Placed Order** · **zero times** · **since starting this flow**.
4. Save, then check that the flow and every email in it are set to live.

Klaviyo says pre-built flows are "populated automatically", but it doesn't promise this filter is included. Open yours and check.

## How I tested it with a real checkout

I set this up on Harbor Lane Coffee, a demo Shopify store with an invented brand and test payments. My flow waits 1 hour, sends the first email, waits 23 hours, then sends the second. The profile filter is the one above.

Then I ran a real test checkout: not a preview, an actual order. Shopify lets you [place a test order by simulating a transaction](https://help.shopify.com/en/manual/checkout-settings/test-orders) with its test payment gateway, so no real card is charged.

- **Minute 0:** checkout started.
- **Minute 3:** paid through Shopify's test payment gateway.
- **Minute 4:** the post-purchase thank-you email arrived.
- **A day later:** still no cart reminder.

Klaviyo's profile timeline showed Viewed Product, Added to Cart, Checkout Started, Placed Order and the post-purchase email. Nothing from the abandoned cart flow.

What this proves, and what it doesn't: the order landed inside the 1-hour wait, and the purchase filter is the only rule in that flow that looks at orders. That's where the profile stopped. I didn't run a second checkout with the filter turned off, so I haven't shown the reminder going out without it. If you want that proof on your own store, run the same test once with the filter and once without.

A preview shows the email looks right. Only a real checkout shows the flow behaves right. The full write-up, with screenshots of the flows and the email, is in the [Harbor Lane case study](/case-studies/harbor-lane-shopify/).

## Is the abandoned cart flow worth this much care?

Yes. It's the flow closest to a sale. Klaviyo's benchmark report says [abandoned cart flows drive the highest average revenue per recipient of all flows](https://www.klaviyo.com/blog/abandoned-cart-benchmarks): $6.77 per email recipient, with an average click rate of 6%.

Those are Klaviyo's averages across its customers in its 2026 report, not numbers from my demo store, which has no real shoppers. The same report puts the welcome series just ahead on clicks. Those two flows are where I would start on any store.

## What else should the abandoned cart email do?

The filter stops the wrong email. These make the right one work:

- **Show the actual cart.** Product image, variant, quantity and price, pulled from the checkout event. "You forgot something" with no product gives them nothing to click on.
- **Link back to their checkout, not your home page.** In my test, the Checkout Started event carried the customer's own checkout link, so the button reopens their cart as they left it.
- **Make the second email different.** Answer the doubt that may have stopped them, such as shipping cost or returns, instead of repeating email one.

## When is the default setup fine?

If your flow already has the purchase filter as a profile filter, you're done. Don't rebuild a working flow.

You also don't need a developer for the filter itself. It's one rule in the flow settings.

Where help pays off is the work around it: product blocks that pull the right image and variant, a welcome flow that splits new and existing customers, with unique coupons, and GA4 purchase tracking that works with Shopify's checkout. Those are the pieces I set up in the [demo store case study](/case-studies/harbor-lane-shopify/) and offer on my [Shopify page](/shopify-expert/).

## Checklist: is your abandoned cart flow safe?

1. Open the flow. Is there a profile filter for **Placed Order zero times since starting this flow**?
2. Is it a **profile** filter, not only a trigger filter?
3. Are the flow and every email in it set to **live**?
4. Does email one show the **real cart** and link back to the **customer's checkout**?
5. Run one **real test checkout**: start checkout, pay within the delay, and confirm no reminder arrives.

If step 5 sends you a reminder after you paid, the filter is missing or set up wrong. Fix it before your next customer gets one.
