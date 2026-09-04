---
layout: post
title: "Did I Really Build Any of This?"
image: /assets/img/did-i-really-build-any-of-this.png
tags: ai agents programming authorship nostalgia sharpvision
---

A few weeks ago I wrote about [Nostalgia](https://github.com/pavkam/nostalgia-es-1841-emulator), the emulator for the ES-1841 computer I used as a kid. In that post I described one of the more interesting bugs I found while trying to boot DOS.

`MSDOS.SYS` was loaded from the floppy image and, a few hundred instructions later, the CPU wandered into uninitialized memory. I could see that something was wrong but could not figure out why. So I asked an agent to investigate it.

The agent wrote a small Python script to extract the original file from the floppy image, disassembled it with `ndisasm`, compared that output with the CPU trace from the emulator, found the badly implemented instruction, and fixed it. **Twenty minutes later DOS continued booting.**

And then I wrote that **we found the bug**.

Well, did **we**? And who is **we**?

I found the symptom. The agent performed the investigation and found the bug. If another developer had extracted the file, disassembled it, compared the traces, located the broken instruction, and written the fix, I would have no problem saying that _they_ fixed it.

Replacing that developer with an agent makes the wording strangely confusing (or misleading).

## The work is real

This is more or less how both Nostalgia and [SharpVision](https://github.com/pavkam/sharp-vision) have been built.

It was not one prompt followed by a finished emulator the next morning. I actually tried the hands-off approach with Nostalgia and it produced code that looked reasonable while being quite far from correct. That is not especially useful when one wrong DMA inverted pin can corrupt DOS long after the emulator appeared to work.

So I gathered _datasheets_, _BIOS listings_, _MAME source code_, _ISA documentation_, and whatever else I could find about the machine. I created instructions and skills for the agents. I made them write tests for individual components and integration tests that boot the real BIOS and real DOS images. Then I ran the emulator, found what was broken, and sent them back into the code.

SharpVision has been the same process with a different set of problems. Instead of a DMA controller and `REP STOSB`, I get to care about layout, Unicode grapheme clusters, input routing, terminal modes, rendering, control ownership, and all the other small details hidden inside the phrase _“terminal UI library.”_

The repository now has a very large `AGENTS.md` file explaining how all of this is supposed to work. There are rules about architecture, naming, tests, documentation, public APIs, and even where each type is allowed to live. The agents write the code, I review it (well, I try to!), run it, find problems, and ask for another pass.

Sometimes the result is good. Sometimes an agent creates several new abstractions to solve a problem that required one condition. Then I ask it to remove everything and try again.

This can continue for days. It is work. Quite a lot of work, actually.

> **But I am not writing the software, I am telling the agents what to write!**

## SharpVision made it harder to ignore

Nostalgia has an external definition of correctness. There was a real machine. There is a real BIOS. Either the hardware behaves closely enough or it doesn't. My job was to collect the information, decide what level of accuracy I wanted, and keep driving the agents until the software matched it.

SharpVision is more personal because many of its rules are simply my preferences about how **my** UI library should work. Mutable controls, deterministic state, explicit ownership, correct terminal cleanup, documentation that describes what is actually implemented, and tests that prove observable behaviour instead of private calls -- those are all choices I made.

An agent left alone would not have built SharpVision in its current form. It would not have built Nostalgia this way either. Both projects are full of decisions I made and rules I insisted on.

> **And yet, when I look at the code, I do not get the same feeling I get from software I wrote myself.**

I remember the requests. I remember running the examples and finding a visual problem. I remember telling the agent that a test proved nothing, that an abstraction had no reason to exist, or that the implementation contradicted the specification. I remember the diffs and the repeated rounds of corrections.

What I **do not** remember is working through most of the implementations, because I did not work through them. The agent did.

Spending months doing this does not make that distinction disappear. It just means I managed the work for several months.

## Programming at a higher level

The usual description one finds these days is that this is simply programming at a higher level. Instead of writing code, I write specifications, define constraints, and review the result.

Maybe. It definitely sounds better than a _“glorified product manager.”_

But an agent is not a compiler translating an implementation I already wrote. It reads a request and makes its own implementation decisions. It chooses which files to change, how to structure the code, what tests to add, and which entirely unnecessary factory should exist until I notice it.

I can constrain those decisions. I can reject them. I can write another page of rules so that the same mistake does not return next week under a slightly different name.

> **But I am still reacting to an implementation produced by something else.**

If a product manager described a feature, reviewed every change, reported bugs, and decided when it was ready, nobody would say that the product manager wrote the feature. Even if they were technical. Even if they understood exactly why an implementation was wrong.

Replace the engineers with agents and suddenly the manager becomes the author. **Very convenient.**

SharpVision and Nostalgia are my projects. I decide what they should be, I keep them moving, and I am responsible for what ends up in their repositories. But none of that changes how they feel to me.

> **I do not feel like I created them. At most, I feel like a glorified manager who spent several months telling agents what to build.**

It's a bit (okay, a lot) sad to be honest, but I also cannot make myself write all that code myself. Not taking advantage of all this speed somehow feels even worse.

Well, that's enough rambling for Today, thanks for reading!
