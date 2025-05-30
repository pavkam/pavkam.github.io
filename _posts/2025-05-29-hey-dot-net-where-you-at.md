---
layout: post
title: Hey .NET, where you at?
image: /assets/img/cursor-dotnet.png
tags: ai cursor editors programming dotnet
---

> This article originally started as a "short delve" into the process of using [Cursor](https://www.cursor.so/) editor to write [.NET framework](https://dotnet.microsoft.com/) code. As I was writing it though, it quickly mutated into more of a commentary.
>
> Enjoy!

It's no surprise to anyone that knows me that I think [.NET (Core)](https://dotnet.microsoft.com/) is a fantastic framework to develop backend services in. That being said though, it has been a while since I gave the new versions of .NET and C# a good thorough look.

In my current position at [Bucket.co](https://bucket.co) I deal exclusively with TypeScript and Go for backend and frontend development and haven't had the need to touch the .NET ecosystem in a while.

While Bucket is laser focused on TypeScript and JavaScript developers, and our SDKs are designed for that ecosystem, I found a small opportunity to refresh my .NET skills by creating a .NET SDK for our platform as a side-project. (Because who needs free time, right?)

Additionally, since my last full-time .NET job, the world of software development underwent a massive shift -- think [LLMs](https://en.wikipedia.org/wiki/Large_language_model), Agents and "all things" AI. Cursor IDE has been my driver for the last 6 months. It has great support for Typescript and Go and helps a lot with boilerplate code (**no, it's not writing all my code for me**). Needless to say, I wanted to put it to the test with .NET.

## The start

I did not expect the process to be smooth or easy. First of all, VS Code is a **horrible** IDE *(I know, I know, let's pretend it's not an IDE)* and Cursor, being a fork, is no better. Luckily, I also have a [JetBrains](https://www.jetbrains.com/) license that gives me access to [Rider](https://www.jetbrains.com/rider/), which is light-years ahead in DX. I had a comfortable IDE to fall back to when Cursor got on my nerves too much (which was more often than I hoped).

To start, I assumed that it wouldn't be too difficult to convert our [node.js SDK](https://github.com/bucketco/bucket-javascript-sdk/tree/main/packages/node-sdk) to .NET. After all it's just an SDK, that calls the [Bucket API](https://docs.bucket.co/api/api-reference) and does some additional state keeping, like refreshing feature definitions and output batching. How hard could it be right?

Maybe it's just me, but, when writing a .NET library I tend to use more purpose-driven primitives, not available in Javascript. This tends to take up more time as you are picking and choosing more carefully the right approach for each use case.

### Typescript to .NET

It all started with me asking Cursor to convert our node.js SDK to .NET code. I never done that before and did not have high expectations. Surprisingly, after a few tries, there was some generated code that one could use as a start. Now, don't get me wrong -- **the code was completely wrong** and was basically trying to use Javascript development patterns in .NET. But, it was enough for me to dump it into a new .NET project and start writing proper code on top of it.

If you ask me, I don't know if this conversion helped much, but it certainly thought me "things" and gave me something to start from.

Side note: all models failed spectacularly, it's not a specific LLM model problem, but just the way LLMs work in general.

### Which .NET version to target?

One of the first decisions when starting a .NET library is deciding *which .NET* to target. In 2025, we have .NET 6, 7, 8, 9... Then we have the compatibility targets such as .NETStandard 2.0 and 2.1. Initially I chose to use .NETStandard 2.1 for the SDK and .NET 8 for the test project. The idea was to make sure the SDK could be used by .NET Framework (Windows-only, legacy one). During the development, though, many small issues started popping up like unsupported C# features, missing library functionality and etc. Then, after some googling (are we still calling it that?), it became apparent that all new projects should target the newest .NET frameworks and also, that .NETStandard 2.1 is not actually compatible with .NET Framework which negated the entire purpose of using it in the first place. And no, I was not going to bother with using .NETStandard 2.0 as that would prohibit me from using new C# language features I wanted to try out.

So .NET 9+ it is then. Also, makes sense for Bucket as it is highly unlikely that companies with products in  `.NET Framework` would ever choose to mess with their code bases by as switching their *feature flagging* provider.

### Back to strong types and multi-threading

Since the original SDK was written for the *"shapeless, single threaded world"* of Javascript, it took a while to adjust
my approach back to the strongly-typed, multi-threaded world of .NET.

The `JSON` processing was, surprisingly, more complicated than I remembered (or thought it would be): you can't simply
define a "type" and then assume it's correct at run time. This meant that all request/response types had to be explicitly defined and polymorphism considered. Technically I could have simple used [JsonDocument](https://learn.microsoft.com/en-us/dotnet/api/system.text.json.jsondocument?view=net-9.0) but that would negate the point of a strongly-typed language. I don't want to deal with type checking, let the framework do that.

Concurrency was another big difference that needed to be accounted for. Node.js is single-threaded and things are just simpler by definition. .NET is multi-threaded so all the classical issues that arise from that had to be dealt with: race conditions and shared access to resources. Additionally, while [`CancellationToken`](https://learn.microsoft.com/en-us/dotnet/api/system.threading.cancellationtoken) in .NET is amazing, it can get a bit much to maintain all potential failure states in one's mind (cognitive complexity is much higher than Javascript).

So how did Cursor do with C#? Pretty well actually. The *"tab tab tab paradigm"* (yes!) works as well as it does in other
languages. Code generation is good enough, though it's not great at generating correct multi-threaded code for obvious reasons: it has no capacity for **"understanding"** what is happening and multi-threaded code requires this capacity to be correct.

It would often suggest code that was obviously incorrect but looked OK. While it predicted the "shape" of the desired outcome it simply was incapable of creating correct code to match that "shape".

But, compared to Copilot or the abysmal JetBrains AI, it was still much better.

### Testing

Testing was the hardest part of the entire process for me.

Oh, how surprised I was when no debugging was possible in Cursor. The debugger was not **"licensed"** for use outside VS Code. Later on Microsoft decided to prohibit the use of its extensions completely in Cursor (see below). That meant that I could not debug tests effectively which would have made my life very miserable. Thankfully, I had Rider to take the reigns and help me run tests and debug them.

> I just can't express how poor VS Code and its forks are at debugging. I just can't...

Anyway, I started a new [`MSTest`](https://learn.microsoft.com/en-us/dotnet/core/testing/unit-testing-with-mstest) project and only later realized that it's "deprecated" in favor of [xUnit](https://xunit.net/). I switched, mid-point to xUnit v3 and then encountered issues with support in Rider which forced me to use an "Early Access Version" of Rider to get support for xUnit v3 runner.

While Cursor is great at generating `60%` of unit tests correctly for our Typescript-based code, it had a hard time with .NET tests. Some tests it generated almost perfectly, others, would be complete nonsense. This was disappointing as I lost much of the fun that Cursor provides -- just write those damn tests for me and let me enjoy the coding!

Aside from that, too much time was spent on figuring out why tests fail in CI and pass locally. Small differences in
how xUnit runs in environments resulted in parallelization issues and etc. Things that made my life quite miserable.
I managed to get things fixed in time but it left a bad taste in my mouth.

> And really, can we get Cursor as a plugin in JetBrains IDEs, please?

### Formatting and Linting

I like that `dotnet` command has built-in support for formatting and linting (analyzers). Generally it's good enough but not the best. You get spoiled by tools like [`prettier`](https://prettier.io/) and [`eslint`](https://eslint.org/). Rider has great code formatting and fixing but it can't be used within a `CI` environment which is a bummer, so I chose to stick to "sanctioned" tools only.

As a funny side note, I tried to use Cursor to generate a good enough `.editorconfig` for C# development and man did it fail. Hard. Many times. After much experimentation I gave up and went to [Code-style rule options](https://learn.microsoft.com/en-us/dotnet/fundamentals/code-analysis/code-style-rule-options) and manually crafted the config following each described rule. Now, I'm a stickler for consistency and style so I might not be the norm.

The biggest gripe I have is the output of these tools is quite opaque and not the best when it comes to CLI. I think that can be improved to give good and precise errors (throw in some colors while you're at it).

### The .NET "vibes"

The "feel" of developing within any ecosystem is very subjective. Even if one can argue that there are objective reasons behind their choices, it's mostly a moot point overall. Personally, for me, .NET and C# feel good because:

- Obviously, I have a lot of previous experience with .NET (in all shapes and platforms),
- The things are where they are supposed to be (most of the time),
- The style is consistent and self-explanatory (naming, `async` vs blocking, primitives),
- It's a good mixture of "easy" vs "hard",
- Run time type safety! (no explanation needed for this one),
- I am stupid, I admit that, I like when the tools keep me from making mistakes,
- It's fast. Development is fast, building is fast. Testing is fast.

To be fair, my opinions are colored by my most recent experiences with Go, Typescript, Python and Kotlin. I don't have the time or the interest to compare ecosystems here so you'll have to take my word for it (or don't, it's subjective).

In terms of new features in .NET (since I last used it years ago), I liked them, though there weren't many of them that are notable. C# is pretty much C#, and the framework has some new primitives, but as long as you're comfortable with .NET, you'll feel right at home.

### Microsoft is still Microsoft

During the period while I was using Cursor to help me develop the library, guess what happened? Microsoft decided that
all those "forks" of VS Code are *"ungrateful moochers"* and made many of their extensions refuse to work. Understandably in a very limited way, but a bad move neither the less.

I was forced to "pin" the **C# Dev Kit** extension to the last version that was still working. Obviously, this is a major turn-off and I would not start a new .NET project in Cursor if the tools aren't there.

This could be a temporary situation, and VS Code might catch up with Cursor. But then again, it might not. Uncertainty and distrust is not the way to build or expand a community.

But maybe they've seen the writing on the wall -- maybe it doesn't matter any longer? If we truly believe that agents will write all the code why would .NET or Typescript or any other language matter?

I stand firmly in my conviction that .NET is still one of the best frameworks out there. The "**batteries included**" approach is very refreshing when coming from the more commonly used ecosystems like `node.js` or `Go` -- not having to install thousands of packages for every little piece of functionality is great!

The reason, I believe it will **never be considered a viable** alternative to other frameworks is -- **drum roll** Microsoft. Classic Microsoft. Even in 2025, when the importance of code in general is steadily dropping, they have a hard time going with the flow. *(Ironically, they have no problem using other open source ecosystems for their need -- React and Rust anyone?)*

In a way, it reminds me of **[Delphi](https://www.embarcadero.com/products/delphi)**, once a leader in Windows development. In the last decades, the owner of Delphi has consistently refused to make any tools "free to use" in order to force all its existing customers to pay.

## Conclusion

So how much of a difference did Cursor make? I would say quite a bit:

- It did help with a lot of scaffolding,
- Helped set up things that I did not use before in .NET,
- Helped me create a large set of sample code from scratch,
- As I mentioned, auto-complete saved much time,
- It did help with setting up some tests, but not as much as I hoped,
- Wrote documentation! Both teh READMEs and the XMLDoc in code.

That being said, since Microsoft decided to do a pull-rug, it's pretty much a moot point as of end of May 2025, and I would not recommend using Cursor for .NET development.

You can see the final product here: [Bucket .NET SDK](https://github.com/bucketco/bucket-dotnet-sdk) if you are curious.
