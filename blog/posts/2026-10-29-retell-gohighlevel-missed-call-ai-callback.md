---
title: How to build a missed-call AI callback with GoHighLevel and Retell
seo_title: Retell AI GoHighLevel missed call callback: step by step
description: How you would build a missed-call AI callback: a GoHighLevel workflow, a text, a Retell call. What our demo covers and which steps it did not run.
date: 2026-10-29
slug: retell-gohighlevel-missed-call-ai-callback
service: /white-label-ai-voice-agent/
service_label: White-label AI voice agent for GoHighLevel agencies
tags: gohighlevel, retell ai, missed call text back
---
A GoHighLevel workflow spots the missed call and texts the caller, then a webhook asks Retell to call them back with an AI agent. This is how you would build it. We did not run the GoHighLevel steps in our demo.

Blue Ridge Plumbing is a made-up business, not a client. Its repo has a Retell agent prompt, a `log_outcome` function and a dashboard, but no GoHighLevel code.

The 8-second text and 52-second callback it shows are demo figures. No code measures them, so plan to time your own.

If you own the business, read the plain-English steps and hand the "For your developer" section to whoever builds it.

## Why call back in under a minute?

Many people who just called a plumber want to talk, not type. The best-known data on response speed is old, and it covers web leads, not phone calls.

A [2007 InsideSales.com study](https://www.mortech.com/hs-fs/hub/25649/file-13535879-pdf/docs/mit_study.pdf), presented with James Oldroyd, looked at more than fifteen thousand leads at six companies. The odds of reaching a lead dropped 100 times when the first call came at 30 minutes instead of 5. It is vendor data about web leads, so treat it as a direction, not a forecast.

If you want to size your own missed-call problem first, we covered that in [how many calls a plumber misses](/blog/plumbing-missed-calls-cost/).

## What the flow looks like

The Blue Ridge dashboard shows four stages: Missed, Texted, Called, Booked. It is styled after a GoHighLevel pipeline, but it is not one. Here is the chain as you would build it in GoHighLevel:

1. A call to the business number goes unanswered.
2. GoHighLevel's workflow trigger fires on that call outcome.
3. The workflow sends an SMS: sorry we missed you, reply here or we will call you back in about a minute.
4. The workflow waits, then sends a webhook.
5. The webhook asks Retell to call the customer with the recovery agent.
6. The agent finds out the problem, how urgent it is and the address, then offers two time windows.
7. Before the goodbye, the agent sends the outcome (booked, callback requested, declined, and so on) to your server, which writes it back.

The demo prompt also describes estimate follow-ups and past-customer check-ins, but those do not work as they stand. No job or price reaches the agent, because the demo passes no variables, and the opening line is always the missed-call one. You would need to add both. Our tests only cover the missed-call callback.

## Step 1: the GoHighLevel workflow

GoHighLevel's call trigger is called [Call Details](https://help.gohighlevel.com/support/solutions/articles/48001212511-workflow-trigger-call-details). Set it up like this:

- **Trigger:** Call Details, with Call Direction set to incoming and Call Status set to the outcomes that mean "nobody picked up", such as no-answer, busy and voicemail. Use the In Phone Number filter so only your main line counts.
- **Action: Send SMS.** Keep it short and honest. Say a callback is coming so the AI call is expected, not a surprise.
- **Action: Wait.** The [Wait action](https://help.gohighlevel.com/support/solutions/articles/155000002470-workflow-action-wait) accepts seconds, so a 30 to 45 second pause is possible. It gives the caller a moment to reply by text first.
- **Action: Custom Webhook.** The [Custom Webhook action](https://help.gohighlevel.com/support/solutions/articles/155000003305-workflow-action-custom-webhook) can send a POST with a raw JSON body, a bearer token, and merge fields like `{{contact.phone}}`. You can point it straight at Retell or, better, at your own small server that adds checks before calling Retell.

Two settings people miss. A draft workflow does not run on live calls, so publish it after testing. And think about re-entry: someone who calls three times in ten minutes should not get three AI callbacks.

## Step 2: the Retell agent

This part we did build. The Blue Ridge agent is a single-prompt Retell agent on GPT-4.1. The prompt tells it this is an outbound call to someone missed within the last minute.

It should apologise briefly and get to the problem fast, because plumbing callers often have water on the floor. A few rules from the real prompt do most of the work:

- Emergencies (burst pipe, no water, sewage, flooding) get today's first slot. Everything else gets the next window.
- Offer two time windows, never a list.
- Never quote a price for unquoted work. Give the $89 diagnostic call-out fee and say the technician quotes on site.
- Confirm the street name back.
- If they ask for the owner or a real person, don't argue. Say the owner will call back today, and log it as "callback requested".
- Two sentences per turn at most.

Retell lets you put [dynamic variables](https://docs.retellai.com/build/dynamic-variables) in the prompt with double curly braces, like `{{customer_name}}`, and fill them per call. The demo does not use them yet. A real build should, so the agent knows who it is calling and why.

## Step 3: placing the call and saving the result

In your build, the webhook would have your server ask Retell to place the call, filling in the caller's name and the reason. During the call, the agent has one custom function, `log_outcome`. The prompt requires it on every call, before the goodbye line, because once the caller hangs up the call may be gone.

These are the real fields: name, phone, intent, address, urgency, appointment, objection, outcome and summary. The first two, intent and outcome are required. The outcome is one of booked, callback requested, objection - financing offered, declined, or no answer.

Watch the name field. The demo prompt never tells the agent to ask for a name, so it can save "Customer". Pass the name in as a variable, or add a rule to ask.

In the demo the record lands on a dashboard and nothing more. In a real GoHighLevel account, the handler would need to upsert the contact (update it, or create it if new), create the appointment on the right calendar and move the opportunity to Booked. We covered those GoHighLevel calls and the double-booking traps in [booking appointments into GoHighLevel](/blog/ai-phone-agent-gohighlevel-booking/).

## For your developer: the API call and the webhook

Business owners can skip this section. The call is one request to Retell's [create phone call endpoint](https://docs.retellai.com/api-references/create-phone-call), `POST https://api.retellai.com/v2/create-phone-call`. The `from_number` must be a number bought from Retell or imported into it. Every `retell_llm_dynamic_variables` value must be a string.

```json
{
  "from_number": "+1YOURRETELLNUMBER",
  "to_number": "{{contact.phone}}",
  "override_agent_id": "agent_YOUR_RECOVERY_AGENT",
  "retell_llm_dynamic_variables": {
    "customer_name": "{{contact.first_name}}",
    "flow": "missed_call"
  }
}
```

Retell's docs note that a Retell-purchased number supports US destinations only. Outside the US, check your telephony setup first.

Retell [sends a custom function](https://docs.retellai.com/build/single-multi-prompt/custom-function) as a POST with `name`, `call` and `args`, and the agent reads whatever you return. This is the shape of the handler behind the demo, trimmed:

```python
@app.post("/retell/{agent}")
async def retell_webhook(agent: str, request: Request):
    body = await request.json()
    if "name" in body and "args" in body:      # custom function call
        args = body.get("args") or {}
        call = body.get("call") or {}
        args.setdefault("phone", call.get("from_number", ""))
        store(agent, args)
        # this text goes back to the agent, so keep it sayable
        return {"result": "Saved. The details are recorded in the system."}
    return {"ok": True}
```

That `from_number` default suits inbound calls. On a callback, it is your own Retell number, so use `to_number` there. For production, also verify the `X-Retell-Signature` header Retell sends, so nobody else can post fake bookings to your endpoint.

## What about consent and the TCPA?

This part needs a lawyer, not a blog post, but here are the facts. In February 2024 the FCC [ruled](https://docs.fcc.gov/public/attachments/FCC-24-17A1.pdf) that AI-generated voices count as "artificial" voices under the TCPA, so those calls need the prior express consent of the called party unless an emergency purpose or exemption applies. A footnote in the same ruling adds that calls with an ad or telemarketing need prior express written consent.

Calling back someone who rang you a minute ago is a different situation from cold-calling a list, but don't assume that makes it automatically fine. Keep the callback strictly about their call, have the agent say who it is calling from in the first sentence, respect a "don't call me" immediately, and get advice on your consent wording. The estimate and reactivation calls are closer to marketing, so they deserve the most care.

## Test it before a customer hears it

Miss a call from your own phone, check the text timing, let the callback ring through and book a slot. Then repeat with voicemail, a wrong number, a caller who wants a human, and someone who calls twice. Simulated callers help too; our method is in [how we test AI phone agents](/blog/how-we-test-ai-phone-agents/).

## What it costs to run

Retell's [published pay-as-you-go rates](https://www.retellai.com/pricing) are, per minute: $0.055 for voice infrastructure, $0.015 for a default voice, $0.045 for GPT-4.1 and $0.015 for US telephony. A Retell phone number is $2 a month. That is about 13 cents a minute, so a two-minute callback costs roughly 26 cents. GoHighLevel bills SMS at your account's rate.

If you would rather have it built, our prices are on the [pricing page](/pricing/), and agencies can resell it through the [white-label voice agent](/white-label-ai-voice-agent/).

## When it isn't worth it

If you miss only a few calls a week and someone checks texts quickly, a text-back alone may be enough. If your calendar is a mess, the agent will book into the mess. Fix that first.

## Checklist

1. Confirm your main number's missed calls show up in GoHighLevel call logs.
2. Build the Call Details trigger, the SMS, the Wait and the webhook, and leave it in draft.
3. Create the Retell agent with a `log_outcome` function and test it in the browser.
4. Buy or import the number Retell will call from.
5. Get your consent wording reviewed.
6. Run the failure cases above, then publish.

The next step is to look at the [recovery demo dashboard](https://voicedesk-h31g.onrender.com/agent/recovery). It shows sample records, not a call you can place, so use it to decide which fields you want saved.
