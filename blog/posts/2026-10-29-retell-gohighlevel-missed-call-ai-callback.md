---
title: How to build a missed-call AI callback with GoHighLevel and Retell
seo_title: Retell AI GoHighLevel missed call callback: step by step
description: A GoHighLevel workflow catches the missed call, texts the caller, and has a Retell agent call back within a minute to book the job. Here is the full build.
date: 2026-10-29
slug: retell-gohighlevel-missed-call-ai-callback
service: /white-label-ai-voice-agent/
service_label: White-label AI voice agent for GoHighLevel agencies
tags: gohighlevel, retell ai, missed call text back
---
A GoHighLevel workflow notices the missed call, sends a text, and then fires a webhook that asks Retell to place an outbound call with an AI agent that already knows who it is calling and why. In our Blue Ridge Plumbing demo, the text goes out 8 seconds after the missed call and the AI callback starts 52 seconds after it, and the agent books the job on that call.

Most guides stop at the text-back. This one covers the whole chain, from the trigger to the booking written back. Blue Ridge is a demo business we built to show the flow, not a client. You can see its dispatch desk live on the [recovery demo](https://voicedesk-h31g.onrender.com/agent/recovery).

## Why call back in under a minute?

Many people who just called a plumber want to talk, not type. The best-known data on response speed is old and comes from web leads rather than phone calls: a [2007 InsideSales.com study](https://www.mortech.com/hs-fs/hub/25649/file-13535879-pdf/docs/mit_study.pdf) presented with James Oldroyd, covering more than fifteen thousand leads at six companies, found that the odds of reaching a lead dropped 100 times when the first call came at 30 minutes instead of 5. It is vendor data about web leads, so treat it as a direction, not a forecast. If you want to size your own missed-call problem first, we covered that in [how many calls a plumber misses](/blog/plumbing-missed-calls-cost/).

## What the flow looks like

In the Blue Ridge demo, every missed call moves through four pipeline stages: Missed, Texted, Called, Booked.

1. A call to the business number goes unanswered.
2. GoHighLevel's workflow trigger fires on that call outcome.
3. The workflow sends an SMS: sorry we missed you, reply here or we will call you back in about a minute.
4. The workflow waits, then sends a webhook.
5. The webhook asks Retell to call the customer with the recovery agent.
6. The agent finds out the problem, how urgent it is and the address, offers two time windows, and books one.
7. Before the goodbye, the agent sends the outcome (booked, callback requested, declined, and so on) to your server, which writes it back.

The same agent also follows up unaccepted estimates and calls past customers about an annual maintenance check. Only the trigger and the variables change.

## Step 1: the GoHighLevel workflow

GoHighLevel's call trigger is now called [Call Details](https://help.gohighlevel.com/support/solutions/articles/48001212511-workflow-trigger-call-details) (older guides call it Call Status). Set it up like this:

- **Trigger:** Call Details, with Call Direction set to incoming and Call Status set to the outcomes that mean "nobody picked up", such as no-answer, busy and voicemail. Use the In Phone Number filter so only your main line counts.
- **Action: Send SMS.** Keep it short and honest. Say a callback is coming so the AI call is expected, not a surprise.
- **Action: Wait.** The [Wait action](https://help.gohighlevel.com/support/solutions/articles/155000002470-workflow-action-wait) accepts seconds, so a 30 to 45 second pause is possible. It gives the caller a moment to reply by text first.
- **Action: Custom Webhook.** The [Custom Webhook action](https://help.gohighlevel.com/support/solutions/articles/155000003305-workflow-action-custom-webhook) can send a POST with a raw JSON body, a bearer token, and merge fields like `{{contact.phone}}`. You can point it straight at Retell or, better, at your own small server that adds checks before calling Retell.

Two settings people miss. A draft workflow does not run on live calls, so publish it after testing. And think about re-entry: someone who calls three times in ten minutes should not get three AI callbacks.

## Step 2: the Retell agent

The Blue Ridge agent is a single-prompt Retell agent on GPT-4.1. The prompt tells it this is an outbound call, that the person was missed within the last minute, and to apologise once and get to the problem fast, because plumbing callers often have water on the floor. A few rules from the real prompt do most of the work:

- Emergencies (burst pipe, no water, sewage, flooding) get today's first slot. Everything else gets the next window.
- Offer two time windows, never a list.
- Never quote a price for unquoted work. Give the diagnostic call-out fee and say the technician quotes on site.
- Confirm the street name back.
- If they ask for a real person, don't argue. Log it as "callback requested".
- Two sentences per turn at most.

Retell lets you put [dynamic variables](https://docs.retellai.com/build/dynamic-variables) in the prompt with double curly braces, like `{{customer_name}}`, and fill them per call. That is how one agent can open with "I saw we missed your call" for a missed call and "about the estimate we sent last week" for an estimate follow-up.

## Step 3: placing the outbound call

The call is one request to Retell's [create phone call endpoint](https://docs.retellai.com/api-references/create-phone-call), `POST https://api.retellai.com/v2/create-phone-call`. The `from_number` must be a number bought from Retell or imported into it. The `retell_llm_dynamic_variables` values must all be strings.

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

Retell's docs note that with a Retell-purchased number, only US destinations are supported. If the business is outside the US, check your telephony setup first.

## Step 4: writing the result back

The agent has one custom function, `log_outcome`, and the prompt requires it on every call, before the goodbye line, because once the caller hangs up the call may be gone. These are the real fields: name, phone, intent, address, urgency, appointment, objection, outcome and summary, with outcome limited to booked, callback requested, objection - financing offered, declined, or no answer.

Retell [sends a custom function](https://docs.retellai.com/build/single-multi-prompt/custom-function) as a POST with `name`, `call` and `args`, and whatever you return is read by the agent. This is the shape of the handler behind the demo, trimmed:

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

In the demo the record lands on the dispatch desk. In a real GoHighLevel account, the same handler upserts the contact, creates the appointment on the right calendar and moves the opportunity to Booked. We covered the GoHighLevel calls and the double-booking traps in [booking appointments into GoHighLevel](/blog/ai-phone-agent-gohighlevel-booking/), so we won't repeat them here. For production, also verify the `X-Retell-Signature` header Retell sends, so nobody else can post fake bookings to your endpoint.

## What about consent and the TCPA?

This part needs a lawyer, not a blog post, but here are the facts. In February 2024 the FCC [ruled](https://docs.fcc.gov/public/attachments/FCC-24-17A1.pdf) that AI-generated voices count as "artificial" voices under the TCPA, so those calls need the prior express consent of the called party unless an emergency purpose or exemption applies. Calls that include an ad or telemarketing need prior express written consent.

Calling back someone who rang you a minute ago is a different situation from cold-calling a list, but don't assume that makes it automatically fine. Keep the callback strictly about their call, have the agent say who it is calling from in the first sentence, respect a "don't call me" immediately, and get advice on your consent wording. The estimate and reactivation calls are closer to marketing, so they deserve the most care.

## Test it before a customer hears it

Miss a call from your own phone, check the text timing, let the callback ring through and book a slot. Then repeat with voicemail, a wrong number, a caller who wants a human, and someone who calls twice. We run simulated callers against every agent before launch; the method is in [how we test AI phone agents](/blog/how-we-test-ai-phone-agents/).

## What it costs to run

Retell's [published pay-as-you-go rates](https://www.retellai.com/pricing) are $0.055 a minute for its voice infrastructure, $0.045 a minute for GPT-4.1, $0.015 a minute for telephony, and $2 a month for a Retell phone number. That is about 11.5 cents a minute before any optional voice add-on. A two-minute callback costs roughly a quarter. SMS from GoHighLevel is billed by GoHighLevel at your account's rate.

If you would rather have it built: a voice agent from us is $900 to build plus $450 a month with 500 minutes included, then 15 cents a minute. Agencies reselling it under their own brand pay $400 setup and $250 a month per account. Details are on [pricing](/pricing/).

## When it isn't worth it

If you miss only a few calls a week and someone checks texts quickly, a text-back alone may be enough. If your calendar is a mess, the agent will book into the mess. Fix that first.

## Checklist

1. Confirm your main number's missed calls show up in GoHighLevel call logs.
2. Build the Call Details trigger, the SMS, the Wait and the webhook, and leave it in draft.
3. Create the Retell agent with a `log_outcome` function and test it in the browser.
4. Buy or import the number Retell will call from.
5. Get your consent wording reviewed.
6. Run the failure cases above, then publish.

For a plumbing business, see how this fits on the [plumbing page](/plumbing/). If you are an agency that wants to offer it to your GoHighLevel clients, see the [white-label voice agent](/white-label-ai-voice-agent/).
