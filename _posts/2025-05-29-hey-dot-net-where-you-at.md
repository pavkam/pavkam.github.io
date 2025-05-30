---
layout: post
title: Hey .NET, where you at?
image: /assets/img/cursor-dotnet.png
tags: ai cursor editors programming dotnet
---

> This article originally started as a "short delve" into the process of using Cursor editor to write
> .NET framework code. As I was writing it though, it quickly mutated into more of a commentary.
>
> Enjoy!

It's no surprise to anyone that knows me that I think .NET (Core) is a fantastic framework to develop backend services in. That being said though, it has been a while since I gave the new versions of .NET and C# a good thorough look.

In my current position at [Bucket.co](https://bucket.co) I deal exclusively with Typescript and Go for backend and
frontend development and haven't had the need to touch .NET ecosystem in a while.

While Bucket is laser focused on TypeScript and JavaScript developers, and our SDKs are designed for that ecosystem, I
found a small opportunity to refresh my .NET skills by creating a .NET SDK for our platform as a side-project.

Additionally, since my last full-time .NET job, the world of software development underwent a massive shift -- think LLMs, Agents and "all things" AI. Cursor IDE has been my driver for the last 6 months. It has great support for Typescript and Go and helps a lot with boilerplate code (**no, it's not writing all my code for me**). Needless to say,
I wanted to put it to the test with .NET.

## The start

I did not expect the process to be smooth or easy. First of all, **VS Code** is a horrible IDE (*I know, I know, let's pretend it's not an IDE*) and **Cursor**, being a fork, is no better. Luckily, I also have a JetBrains license that gives me access to **Rider**, which is light-years ahead in DX. I had a comfortable IDE to fall back to when Cursor got on my nerves too much.

To start, I assumed that it wouldn't be too difficult to convert our Typescript SDK to .NET. After all it's just an SDK, that calls the Bucket API and does some additional state keeping, like refreshing feature definitions and output batching. How hard could it be right?

### Typescript to .NET

It all started with me asking Cursor to convert our node.js Typescript SDK to .NET code. Surprisingly, after a few tries, there was some generated code that one could use as a start. Now, don't get me wrong -- the code was completely wrong as it was basically trying to use Javascript development patterns in .NET. But, it was enough for me to dump it into a new .NET project and start writing proper code on top of it.

If you ask me, I don't know if this conversion helped much, but it certainly gave me something to rewrite!

### Which .NET version to target?

Initially I chose to use `.NETStandard 2.1` for the SDK and `.NET 8` for the test project. The idea was to make sure the SDK could be used by `.NET Framework` (Windows-only, legacy one). During the development, though, many small issues started popping up like unsupported C# features, missing library functionality and etc. Then, after some googling (are we still calling it that?), it became apparent that all new projects should target the newest .NET frameworks and also, that `.NETStandard 2.1` is not actually compatible with `.NET Framework` which negated the entire purpose of using it in the first place. And no, I was not going to bother with using `.NETStandard 2.0` -- we're better than that!

So `.NET 9+` it is then. Also, makes sense for Bucket as it is highly unlikely that companies with products in  `.NET Framework` would ever choose to fiddle too much with their code bases, such as switching their *feature flagging* solution. Great for me as well -- I can try out all the new shiny stuff that Microsoft came up with.

### Back to strong types and concurrency

Since the original SDK was written for the "shapeless, single threaded world" of Javascript, it took a while to adjust
my approach back to the strongly-typed, multi-threaded world of .NET.

The `JSON` processing was, surprisingly, more complicated than I remembered (or thought it would be): you can't simply
define a "type" and then assume it's correct at run time. This meant that all request/response types had to be defined
as polymorphic, which opened another can of worms.

Concurrency was another big difference that needed to be accounted for. Node.js is single-threaded and things are
just simpler by definition. .NET is multi-threaded so all the classical issues that arise from that had to be dealt
with: race conditions and shared access to resources. Additionally, while `CancellationToken`s in .NET are amazing,
it can get a bit much to maintain all potential failure states in one's mind (cognitive complexity is much higher than
Javascript).

How did Cursor do with C#? Pretty well actually. The "tab tab tab paradigm" (yes!) works as well as it does in other
languages. Code generation is good enough, though it's not great at generating correct multi-threaded code for obvious reasons:
it has no capacity for "understanding" what is happening and multi-threaded code requires this capacity to be correct.

### Testing

Testing was the hardest part of the entire process for me.

Oh how surprised I was when I could not debug the project in Cursor (as the debugger was not "licensed" for use outside VS Code). That meant that I could not debug tests effectively which would have made my life very miserable. Thankfully,
I had Rider to take the reigns and help me run tests and debug them.

I just can't express how poor VS Code and its forks are at debugging. I just can't...

Anyway, I started a new `MSTest` project and only later realized that it's "deprecated" in favor of xUnit. I switched, mid-point to xUnit v3 and then encountered issues in its support in Rider. I had to use an "Early Access Version" of Rider to get support for xUnit v3 runner.

Too much time was spent on figuring out why tests fail in CI and pass locally. Small differences in
how xUnit runs in environments resulted in parallelization issues and etc. Things that made my life quite miserable.
I managed to get things fixed in time but it left a bad taste in my mouth.

> And really, can we get Cursor as a plugin in JetBrains IDEs, please?

### Formatting and Linting

I like that `dotnet` command has built-in support for formatting and linting (analyzers). Generally it's good enough but
not the best. You get spoiled by tools like `prettier` and `eslint`. JetBrains Rider has great code formatting and fixing but it can't be used within a `CI` environment so I chose to stick to "sanctioned" tools only.

As a funny side note, I tried to use Cursor to generate a good enough `.editorconfig` for C# development and man did it fail. Hard. Many times. After much experimentation I gave up and went to [Code-style rule options](https://learn.microsoft.com/en-us/dotnet/fundamentals/code-analysis/code-style-rule-options) and manually configured each rule.

### The .NET "vibes"

The "feel" of developing within an ecosystem is very subjective, even if there are seemingly objective reasons
behind it. Personally, for me, .NET and C# feel good:

- The things are where they are supposed to be (most of the time),
- The style is consistent and self-explanatory (see `async` vs blocking),
- It's a good mixture of "easy" vs "hard",
- Run time type safety! (no explanation needed!),
- It's fast. Development is fast, building is fast. Testing is fast.

My recent experience is mostly colored by Go, Typescript, Python and Kotlin. They all have some interesting "feels"
to them but they all fail in some regards. I don't have the time or the interest to compare ecosystems here so you'll
have to take my word for it.

### Microsoft is still Microsoft

During the period while I was using Cursor to help me develop the library, guess what happened? Microsoft decided that
all those "forks" of VS Code are *"ungrateful moochers"* and made many of their extensions refuse to work with them.

I was forced to "pin" the **C# Dev Kit** extension to the last version that was still working. That certainly is the way to go, Microsoft! Good job! You're doing the Internet Explorer thing again. The industry is building **much better** tools
and you want to force your developers to use the less effective ones.

It could be a temporary situation, and VS Code might catch up with Cursor. But then again, it might not. As a developer
I will choose whatever tool is the best right now, and the ecosystem that will have the highest chance of being supported.

No need to rant much, but this is the most worrying aspect of developing in .NET right now.

### Conclusion

.NET is still definitely one of the best frameworks out there. The "**batteries included**" approach is very refreshing
when coming from the commonly used ecosystems like node.js or Go: not having to install packages for every little piece
of functionality is great!

The reason I believe it will never be considered as viable an alternative to other frameworks is --
**drum roll** Microsoft. Until Microsoft relinquishes its hold on development tools it will always linger in the background.

In a way, it reminds me of **Delphi** (here's a blast from the past for you!). In the last decades, the owner of Delphi
has consistently refused to make any valuable tools "free to use" in order to force all its existing customers to pay.
This, of course, holds the existing customers hostage while preventing any meaningful expansion of their customer base.
