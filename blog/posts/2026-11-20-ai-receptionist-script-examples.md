---
title: What to put in an AI receptionist's script (with examples)
description: Six parts every AI receptionist script needs, with example lines for a plumbing business, plus what to leave out and how to test it before real calls.
date: 2026-11-20
slug: ai-receptionist-script-examples
service: /voice-agent-engineer/
service_label: AI voice agent build
tags: ai receptionist, call script, prompt writing
---
Put six things in the script: who the agent is, the normal call from start to finish, what it may say about your business, when it hands off to a person, how it should sound out loud, and how each call ends. Keep it short. Retell, a voice agent platform, warns that a longer prompt is not a better one.

An AI receptionist's "script" is really a written brief, called a prompt. The agent reads it before every call. Below is what goes in it, with example lines for a plumbing business. The lines are my own illustration, not a client's script.

## Why should the script be short?

Retell says in its [prompt guide](https://docs.retellai.com/build/prompt-engineering-guide) that "a longer prompt is not a better prompt." Its own restaurant example shrinks from about 970 words to about 300. The guide's advice is to state each instruction once.

GPT-4.1, the model behind my Blue Ridge demo, follows instructions [closely and literally](https://developers.openai.com/cookbook/examples/gpt4-1_prompting_guide), according to OpenAI's guide. That cuts both ways. It does what you write, so a vague or contradictory line gets followed too. When two instructions conflict, the same guide says the model tends to follow the one nearer the end of the prompt.

So write each rule once, in one place, in plain words.

## What are the six parts of a good script?

1. **Role.** One or two lines. Example: "You are the phone receptionist for Example Plumbing. You answer calls, take down the job, and book a visit or pass the call to a person."
2. **The normal call.** The happy path, step by step. Handle the ordinary call first. Add edge cases only when testing shows you need them.
3. **Facts it may state.** Hours, service area, the dispatch fee, what you do and don't fix.
4. **Hand-off rules.** When the agent stops and gets a person.
5. **Voice rules.** How numbers, dates and names should sound.
6. **The ending.** What must happen before the agent hangs up.

Vapi's [prompting guide](https://docs.vapi.ai/prompting-guide) uses six sections of its own, so the exact split is a matter of taste.

## What does the normal call look like in writing?

Write it as short steps in the order a call really goes. A plumbing example:

1. Greet the caller and ask what is going on.
2. Ask one question at a time: the problem, the address, then the best number to reach them.
3. Offer two time slots from the calendar tool, never a time the tool did not return.
4. Repeat the booking back and ask the caller to confirm.
5. Call the booking tool only after the caller says yes.

Vapi's guide asks for one question per turn: collect one detail, confirm it, move on. Retell's guide adds two lines worth copying: say when each tool is called, and forbid announcing a booking while the request is still pending.

## What facts should the script let the agent say?

Only facts you hand it. A pasted block works:

- Open 7am to 6pm, Monday to Saturday. Emergency line after hours.
- Service area: the listed towns, nothing outside them.
- Dispatch fee: the amount you set. No other prices.

Then add the line that matters most: "If the caller asks something not listed here, say you don't know and take a message." My post on [what happens when the agent doesn't know the answer](/blog/ai-receptionist-doesnt-know-the-answer/) shows how to test that line.

A confident wrong quote is worse than "a person will call you back with that."

## When should the script hand off to a person?

Name the triggers, with the action for each:

- **Danger to people.** A gas smell, smoke, a carbon monoxide alarm. One safety sentence, then the call ends. My post on [emergency calls](/blog/ai-phone-agent-emergency-calls/) covers the wording.
- **Urgent property damage.** A burst pipe: book the emergency slot or transfer to the on-call number.
- **An angry caller, or a request for a person.** Transfer, and give the person a one-line summary.

Use phrases, not single words. "Smell" alone would also match a musty basement.

Testing is why this part earns care. My test suite's first run caught 5 missed emergency handoffs in 41 plumbing calls on a cheaper model. The suite uses simulated callers, so no real caller was affected.

A rule on paper is not a rule in practice until a simulated caller has tried to trip it.

## How should the script handle how it sounds?

Text on a page and speech out loud are different. Tell the agent how to read things.

Vapi's guide gives the examples: read $42.50 as "forty-two dollars and fifty cents," and read a phone number in grouped digits. It also says to spell names back to the caller. Retell's guide says to tell the agent how to read dates aloud, and to vary scripted lines naturally instead of reading them word for word.

Keep replies short. Vapi suggests one or two sentences at most.

Put these voice rules in one short block, not scattered through the steps.

## How does the call end?

Decide what must be true before the agent hangs up, and write it as a rule.

In my Blue Ridge missed-call demo, a single-prompt Retell agent on GPT-4.1, the agent must call a `log_outcome` function before it ends the call. Its pipeline moves each lead through Missed, Texted, Called, Booked, so a call with no logged outcome stands out in the log.

That is a prompt rule, not a guarantee. It still turns "did the call go well?" into something you can count.

## What should you leave out of the script?

- **Long "never say" lists.** Vapi warns they can backfire. Retell says to check for a missing requirement or unclear instruction before adding another prohibition.
- **Rules that repeat.** Retell's advice is to state each instruction once.
- **Security you need to enforce.** Whether a caller may hear an account's details cannot rest on a polite prompt. In my own tests, prompt rules and data delimiting cut cross-customer leaks from 14 calls to 6. Giving the agent only the caller's own record took them to 0 ([source](/case-studies/voice-agent-security-evals/)).
- **Anything you have not tested.** If you cannot say how a rule would fail, it is not ready.

## When is a script not the answer?

A script cannot fix a messy business. If your prices change by the job, your calendar is not kept up to date, or half your calls need a judgment call, the agent will hand off most calls and add little. A human answering service may suit you better, and my post comparing the two shows [where each wins](/blog/ai-receptionist-vs-answering-service/).

Check the cost too. My [voice agent build](/voice-agent-engineer/) is $900, then $450 a month with 500 minutes ([pricing](/pricing/)). If few calls go unanswered, a script is not worth that yet.

## Checklist before you go live

- Role in two lines or fewer.
- The normal call as numbered steps, one question per turn.
- A block of facts the agent may state, and a "say you don't know" rule.
- Hand-off triggers as phrases, each with an action.
- One short block of voice rules.
- A rule for what must happen before hang-up.
- At least five test calls: one normal, one off-topic, one angry, one emergency, one asking for a price you did not list.
- Read the first week of call logs and cut any rule the agent never needed.

To hear one finished agent before you write yours, try the [Blue Ridge recovery demo](https://voicedesk-h31g.onrender.com/agent/recovery).
