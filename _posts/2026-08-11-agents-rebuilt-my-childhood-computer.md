---
layout: post
title: Why I "wrote" my own 8086 nostalgia emulator
image: /assets/img/nostalgia-es1841-logo.png
tags: ai agents emulator es1841 8086 nostalgia dotnet programming
---

Long-time readers (hi, both of you) might remember that [I once spent a cross-Atlantic flight reverse-engineering a DOS poster viewer](/2022-10-01-nostalgia-pic-images) just so I could look at "pixel art" I had as a kid on my old **ES-1841** -- a Soviet clone of the IBM PC XT that was my entire computing universe growing up. That was a fun little side quest. This is the sequel nobody asked for: I (**well, not me personally!**) built an **accurate emulator** of the whole machine, chip by chip, and mostly let AI agents write the code.

The result is [Nostalgia](https://github.com/pavkam/nostalgia-es-1841-emulator), a .NET emulator that boots the real ES-1841 BIOS and runs actual DOS floppy and hard disk images, with a `K1810VM86` (8086 clone) CPU, CGA video, `8253` timer, `8259A` PIC, `8237A` DMA, `8255A` PPI, an `8087` FPU, and even the weird Soviet "Kolobok" bus mouse, each modeled as its own hardware component down to the bus signal.

## Why bother

Well, why not? Particularly, because:

1. **Nostalgia.** Obviously. It's in the name,
2. **Fun.** Reimplementing a machine I used to boot as a kid, down to the timing quirks of a Soviet floppy controller,
3. **Curiosity on how far can I drive an AI to do this** -- how far can you push an agent to write real, correct, hardware-accurate code with _minimal_ intervention from me? Not "vibe coded a CRUD app." A cycle-accurate emulator where being off by one DMA terminal count means DOS silently corrupts itself 40 minutes into boot.

## I admit, I had an unfair advantage

I won't lie and say that anyone can do it using one prompt. Not gonna' happen! I tried though, and "just let the agent loop overnight" - didn't work so well. It produced stuff that correct but was far from it. I really wanted to avoid looking at the code but could not make myself **not care**. And when I looked, **oh mama!** that was bad.

So I changed my strategy and started paying attention to what comes out the other end of the coding agent. But before that, I set off to gather all the specs that I could get my hands on:

1. First, **a mountain of primary sources** -- chip datasheets for the `µPD765` FDC, the `8237A` DMA controller, the `6845` CRTC, ISA bus timing docs, everything I could dig up about the ES-1841's Soviet-specific quirks. Agents are excellent at _applying_ a spec once you hand them one. They are much worse at reconstructing an undocumented Soviet peripheral from vibes.
2. Second, **prior art**. [MAME already has a driver](https://wiki.mamedev.org/index.php/Driver:Soviet_PCs) for Soviet PC clones,
3. Third, I managed to get my hands onto the original ES-1841 BIOS - a real saviour! The POST sequence is a treasure trove of information about how the machine is supposed to behave.
4. And fourth, **me**. Specifically, the fact that I actually understand 8086 assembly, and how the hardware is supposed to behave.

I created a directory of specs and multiple skills, each with a different focus. The agent would then use these skills to build the emulator. This really made a big difference in how the new code was written. I had instructed the agent harness to use sub-agents in many cases with "personas" based on the spec and the skill.

## Tests, more tests, and even more tests

With a system this interconnected -- where a timer bug can silently break floppy DMA which breaks BIOS POST which breaks everything downstream -- you cannot review your way to correctness. You need thousands of tests asserting cycle-exact, hardware-visible behavior, and you need the agent writing them constantly, not as an afterthought. And even then the codebase was full of bugs that only manifested after hours of running.

The biggest and by far the most important set of tests were the **integration tests**: one that boots the actual ES-1841 BIOS from power-on through all fourteen POST phases, and one that boots real MS-DOS off a real floppy image, all the way to an `A:\>` prompt. **These are slow, ugly, but man did they help!**.

And funny enough, since I had the original [POST](https://en.wikipedia.org/wiki/Power-on_self-test) routines, I could actually find small spec differences between ES-1841 and the original IBM PC XT BIOS that were not in the documentation.

## What amazed me the most

The best sessions were the ones where the agent went full detective. At one point DOS was loading `MSDOS.SYS` and then wandering off into uninitialized memory a few hundred instructions later. I could not properly pin point the reason why. So I asked the agent to debug. It wrote a quick Python script to pull the raw file out of the floppy disk image, and ran it through `ndisasm` to get a real disassembly of what the file _actually contained on disk_ -- then diffed that against what the CPU trace said it was executing in RAM. And 20 minutes later -- boom! we found the bug (which was a poorly implemented CPU instruction).

Another time, I was running a game called Load Runner, and it wasn't drawing the vertical stairs properly. I though that this was a CGA video issue and was really trying to figure it out. But it was strange since other games or application did not have the same issue. Again, I asked the agent to help and to my surprise it fixed the issue but it was completely unrelated to anything video related. It figured out that this was another `REP STOSB` issue in the code that wasn't properly writing the bytes to the memory. It did the same dance oif extracting the raw file from the disk image and disassembling it to find the issue.

Some of the things it did in the process of debugging and writing code do feel like magic to me...

## Now what?

That's pretty much it. I managed to play a few games from my childhood while testing the emulator. I had fun adding shaders to the CRT to make it look more like the real thing. I learned some interesting lessons in how to "herd" AI agents to write code that is correct and accurate. And I'll leave it at that.

If you're curious here's the repo: [github.com/pavkam/nostalgia-es-1841-emulator](https://github.com/pavkam/nostalgia-es-1841-emulator).

**Cheerios!**
