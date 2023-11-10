---
layout: post
title: Neovim is fine ... I guess
image: /assets/img/neovim.png
tags: vim neovim editors programming
---

There is praise galore on the *interwebs* for this thing called [Neovim](https://neovim.io/). If you are in software, you probably heard of it through a colleague, youtube or somewhere on Reddit. Well, that was my case as well...

> This is the story of my encounter with `neovim`, well, the first 5 months at least

## Some background

Before I start diving into my experience with `neovim` I will need to add some of my background to make the story a bit more grounded *(it's all about subjective experience after all)*.

My interest in programming started early in life around the start of `90s` (that's `1990s` for you *zoomers*). My first ever program was a dumb counter written in `Turbo Basic` for `DOS 4.0` followed by more interesting stuff written in `Turbo Pascal 4` and some `x86 assembly`. Actually, [Turbo Pascal](https://en.wikipedia.org/wiki/Turbo_Pascal) was my first introduction to the promise of IDEs. Granted, it lacked any syntax highlighting, error detection and etc.; but it would compile so quickly that one would not even need those goodies to be productive. It also sported an integrated debugger that made like so much easier.

![TP](/assets/img/turbo-pascal-4.png)

> I was hooked!

Looking back, that might be the reason why I cannot comprehend why some people swear off debuggers like it's some sort of *"programming anti-pattern"*. But, to each their own I guess...

My next IDE of choice was the amazing [Delphi](https://www.embarcadero.com/products/delphi) which took `Turbo Pascal` into the age of GUIs. **Syntax highlighting** and *completion* finally became a thing for me and visual designer made building software a breeze.

From then on:

* I used [Visual Studio](https://visualstudio.microsoft.com/) (from around `2003` to `2019`),
* Fell in love and then started hating [Eclipse](https://www.eclipse.org/ide/). Actually, Eclipse introduced me to the the *"squiggly lines"* underlining errors so I guess one can't be too upset,
* Managed to get along with [NetBeans](https://netbeans.apache.org/front/main/) for a while to do some more Java work,
* And finally found the amazing suite of IDEs from [JetBrains](https://www.jetbrains.com/) like `IntelliJ`, `Rider`, `PyCharm`, etc.

If it's not obvious by now, I stayed firmly on the side of the IDE rather than the editor. I heard about these weirdos using something called `Sublime` or `Atom`, or god forbid `Visual Studio Code`. Why would anyone drink *cheap moonshine* when there is *exquisite champagne* on the next table?

My latest job would see me writing primarily `Go` and `TypeScript` code, and so, `WebStorm` and `GoLand` (JetBrains IDEs) made me productive in no time.

> And so I stayed put, with my feet firmly in the IDE land.

## Vim encounters

Like most people that grew up on the Windows platform, GUIs were all the rage, so using anything command-line based seemed *icky*. My first encounters with `vi` and `vim` came when I started playing with `GNU/Linux` in the early `2000s`. I won't go through the boring details, except to say that the only time you would hear `vim` coming out from my mouth would be in form of

> How the f**k do I exit this damn vim!?

![One does not simply exit vim](/assets/img/simply-exit-vim.jpeg)

And so, it never got used by years *(one can imagine it crying alone in the depths of `/usr/bin`)*

`20` years later, around the year `2020`, inspired by a friend of mine, I tried setting up `vim` for development. It never took off for me. Too many plugins with too many dependencies. It seemed clunky, slow and barely worth wasting my time on.

And so, my `vim` config was left to rot in the depths of my `dotfiles`. One day, in `2023`, while updating my `dotfiles` I tried starting `vim` and it complained that *"such-and-such"* plugin could not be loaded because `vim` was not built with `python` support. Well, OK, not like I ever actually used it.

## Enter Neovim

I had no idea what `neovim` was until `June 2023`. I knew it existed, and that people were showing off their *nerdness* using it but nothing beyond that. And I also wanted a terminal editor that I can use (even for small tasks) and `vim` obviously wasn't cutting it.

Around the same time, the [StackOverflow Developer Survey](https://survey.stackoverflow.co/2023/#section-admired-and-desired-integrated-development-environment) was released and `neovim` was rated **"the most admired"** which piqued my interest quite a bit.

I've done some preliminary research, and was pleasantly surprised that it uses `Lua` for configuration and glueing plugins, as opposed to `VimScript`.

> you can hold a gun to my head, but I will not use `VimScript`.

A bit later, I took a deep breath and starting figuring out how to configure and use it for daily work.

## Motivation

OK, so what's my motivation to start fiddling with `neovim`? Primarily - **curiosity**. Why are people so fanatic about it? What drives people so madly in love with `vim`/`neovim` (sorry `EMACS` don't care, will never care). We all know there are the *"old gray-beards"* that will die before using anything but `vim`, but why are younger people interested in such an antiquated editor? Is it to look cool? Be different? Are they some sort of *"IT hippies"*?

Another motivation is simply **learning new things**. I've been using IDEs for so long that not using an IDE is akin to taking away a person's water in the desert. Can one use an editor + command line tools as opposed to an IDE? Does it improve one's productivity?

And of course, the most important reason - **gotta have something to project a major "I am better that you" vibe.**

> long long time ago, someone said: real geeks use command line.

### Stage 1: it's all a bunch of hacks glued together

The first natural stage is to start looking at peoples' `dotfiles` on `github` to figure out what exactly is one configuring anyway. This stage took a few days of my trying to copy-paste pieces of `lua` code from different repos and seeing what sticks and what not. Needless to say, this did not go very well. It also left a bitter taste in my mouth - everything seemed out of place and *"glued together with spit"*.

I stopped this approach, and then I figured I'd watch some [Youtube](https://www.youtube.com/watch?v=stqUbv-5u2s) [videos](https://www.youtube.com/watch?v=Mtgo-nP_r8Y) to get a better understanding what I am up against.

### Stage 2: NvChad

> a couple weeks later, after procrastinating a bit ...

My first functioning configuration was based on [NvChad](https://nvchad.com/) distribution. A *distribution* is a set of prebuilt `lua` configuration files that one can `git clone` into one's `neovim` config directory. Then, additional configuration can be made in a `user` designated directory as not to modify the distribution's files.

**I liked it**! It was slick and thought me what is *an LSP*, what is *treesitter*, *DAP*, and more. I went ahead and configured some additional plugins, fiddled with remaps and generally, wasted time.

But, after a few weeks of *not using neovim for anything except testing its configuration* I realized that something wasn't right. I was still a complete newbie and I found it very hard to make the *work* tooling function for me. I needed specific linters for `Go` and `TypeScript`, debugging support, unit testing and etc. They kind of worked but not well enough.

> Time to ditch NvChad I said, time to write my own config!

### Stage 3: the shortest one

This stage lasted just a few days. With my newly acquired **chadness**, I started putting up together a configuration of my own. But, soon, my **OCD/ADHD/whatever** took over. Having spent some time studying the code bases of `NvChad` and some other configs I quickly gave up. The amount of inter-dependent components was too much for me to handle.

> That's way too much busy work for my taste - I gots a life.

In retrospect, it's quite obvious now that the complexity was due to `NvChad`'s code organization that makes sense for a distribution but does not make sense for a personal config. But I did not know any better...

### Stage 4: AstroNvim

I found a few other distributions out there but settled on [AstroNvim](https://astronvim.com/). The website contained many examples and seemed ideal for me to tinker with. I ported my `NvChad` config over the next days and started to happily use my shiny new `neovim`.

By the end of `July 2023`, I have finally gotten to the point where I was ready to use `neovim` for work. Well, ... more or less. I would do some small coding tasks in `neovim` and leave the really important coding for `GoLand` or `WebStorm`.

At this point I got pretty comfortable with setting up plugins, configuring my key mappings and in general, tinkering with the editor to a higher degree then before.

I managed to setup my linters, formatters, LSPs, DAP and `neotest` to actually work relatively predictably.

In the same period of time, seeing how much people praise `tmux` I decided to start using it as well. **Totally overkill for my needs, but what the hell, why not?**

A couple of months into using `AstroNvim` I hit a point at which `50%` of my config was dedicated to rebinding every mapping that came pre-defined; and tweaking the configuration of pre-configured plugins. I was not not happy. With that amount of code I could probably have written my own config, instead of fighting `AstroNvim`.

> Here we go again, let me try to roll my config once again!

### Stage 5: the PDE

People define `PDE` as *"Personal Development Environment"*. Basically, configure the s**t out of everything so that it's as tailored to you and your work habits as possible. That was my goal.

I have started by creating a new configuration directory. Tried spinning up a [Kickstart](https://github.com/nvim-lua/kickstart.nvim) git clone and starting from there. I quickly realized that it's not useful to me as I'd have to rewrite the whole thing anyway. Nevertheless I have used it to shamelessly copy-paste some bits of code into my config during the process.

Some bits and pieces I took from my `AstroNvim` based config, some I adapted from another distribution called [LazyVim](https://www.lazyvim.org/) but the entirety of the stitching was done from zero.

One thing I noted after a while is that my config was looking quite shitty compared to `AstroNvim` so I wandered into its codebase to find out what was missing. I discovered a ton of customization that I was not doing. Having learned what I was missing, I adapted some code, wrote some more and arrived at a point where I was happy enough with what I had.

Around `September 2023` I can finally say that the moment was reached where I was more or less happy with my setup. I understood well what is happening, I was in control of the plugins I wanted and the best part - the key mappings were all perfectly suited to the way I think.

The last couple of months from I was able to exclusively use `neovim` for work which is a big achievement.

A side note: *I am very annoyed about inconsistencies. Small things like differently cased key descriptions would drive me crazy. Consistency gives me peace of mind.*

**Here's a couple of self-indulgent screenshots:**

![Neovim 1](/assets/img/neovim-1.jpeg)

![Neovim 2](/assets/img/neovim-2.jpeg)

## Learnings

In the process of figuring out the config I learned a lot about `vim` and `neovim` specifics. Also, rekindled my long-forgotten love for `lua` and managed to improve my terminal kung-fu skills a bit.

The coveted `vim`-motions turned up to be more of a **meh** for me though. Yes, they are powerful and very well suited for quickly editing documents but they are not going to make one into a **2x engineer**. I still like them, and in conjunction with `treesitter-text-objects`, life gets very interesting. the ability to operate on language constructs rather than text is an overlooked benefit of these types of motions.

I discovered that I still use my mouse and `neovim` is quite good at it. I use less of it, that's for sure - `90%` of the use is related to scrolling where I have the proverbial *skill issue*.

Another interesting factoid is that I can't get into `hjkl` navigation. Nothing wrong with those keys, but I never learned to touch-type. I have to occasionally look at the keyboard to get my bearings *(funny story - I tried learning to type without looking but after a few hours started having pain in my wrists so I stopped).* As such, I still use arrow keys and that suits me quite well and I feel that doesn't impede my ability to use `vim`-motions in any sizeable way. Speed was never my goal after all.

On a critical side, `neovim` is definitely not a **"pick it up and start coding"** kind of tool. At least not for people like me that rely on built-in debugger support, prefer in-editor unit testing and etc. It takes quite a while to get to the point where it's comfortable.

Case in point, I had to write my own code to handle `projects` in a sane way as each plugin would decide to configure things based on different strategies.

In other cases, I was forced to study the source code of the plugins I was using as there are many situations where documentation is lacking or there simply are no errors to indicate misconfiguration.

> When using `neovim` assume that *"the hard thing you try to accomplish"* will simply not work by default.

But, as you configure and use `neovim` you gain `neovim`-specific skills which in time simplifies the overall experience.

## The bad

Stability is a major issue in `neovim` for me. And I am not talking about the core editor, but also the overall plugin ecosystem as well. `neovim` by itself is rather useless for people like me, and I bet not just me, but the majority of developer. One needs at least `treesitter` and `lsp` support to work in order to have some semblance of sanity (otherwise just write your code in `nano`). The more plugins you add, the more complex the interactions between the components becomes. This plagues any piece of software, but in `neovim`'s case there's additional factors that compound this problem further - lack of better APIs, no standard plugin architecture with published providers/consumers, etc.

One can check the amount of code in some heavy UI plugins in `github` to get a glimpse of how much work is being wasted on reimplementing the same functionality.

Plugin updates break from time to time when unintended effects are added in one or the other. In my opinion this is directly related to the lack of a good plugin API within the code editor.

**Just random plugin issue**

![Neovim 3](/assets/img/neovim-3.jpeg)

UI is still very `buffer`-`window`-`tab` oriented. Not a problem in itself, but it does result in some very strange behaviors for plugins that want to draw non-editable UX windows (see [neo-tree](https://github.com/nvim-neo-tree/neo-tree.nvim) or [bufferline](https://github.com/akinsho/bufferline.nvim)).

`LSP` and `treesitter` stability is also all over the place. I had my syntax highlighting go haywire on number of occasions during some normal operations, without any ability to reset it. `LSP`s, though technically not related to `neovim`, fail from time to time and need to be restarted. This happens a lot for `tsserver` for instance. I had `gopls` (`go` LSP) die on me on occasion when I created a new empty file.

I know I am going to be screamed at but - **TOO MANY KEY BINDINGS**. It's absolutely paralyzing in the beginning. Everything has a key-binding, every plugin has their own keybindings within their UI.

> keys keys keys everywhere!

One benefit of the GUIs is that one can open a menu and find an operation by name without remembering the keybinding. Especially relevant for functionality which one uses very infrequently. Why remember everything?

You get used to it after a while, but the learning curve is very steep.

I can list many other rough edges, but to summarize it all I want to say, `neovim` is `90%` there and `10%` not even close. Considering it's an open-source, community drive project - **that's pretty good!**

## Conclusion

Should one try out `neovim`? I don't know. Do you want to? I mean, in all honesty, `Visual Studio Code` is pretty OK for most people working on *web projects*. `JetBrains` IDEs are very good for most tasks and excellent for backend development.

`vim`-motions are ubiquitous across the IDEs (most of them provide plugins) so that's not a consideration. Startup time is overrated, as one would typically start the IDE once and use the rest of the day.

Are you a geek and suffering from **"not built by me, IKEA effect"**, then yes, go ahead and try it out, see if it fits. That is what I am doing now.

**The big question**: Will I keep using it. Yes. I do suffer from the [IKEA effect](https://thedecisionlab.com/biases/ikea-effect) and so I find the experience pleasant overall.

I hope this more-or-less honest article gave you some insights into your upcoming pain if you chose to follow my lead. And maybe in `6 months` time I will write another article on where I am at that point.

## Bonus section

> because any good post has to create some controversy doesn't it?

There's no real reason for this section except to annoy people!

The way to achieve "beautiful" `neovim` setups that you seen in people's screenshots is not as straightforward as *start `neovim`*. No, no, you will need a better terminal emulator as well. macOS's `Terminal.app` will not work as it doesn't support the color modes. `iTerm2` on macOS will not do because it doesn't support some attributes for `squiggly underlines`, etc. etc. You will need either [kitty](https://sw.kovidgoyal.net/kitty/) or [wezterm](https://wezfurlong.org/wezterm/index.html) if you want all the goodies.

Additionally, the beautiful icons require one to have [Nerd Fonts](https://www.nerdfonts.com/) installed. It's an entirely different conversation I do not want to have in this article.

So, in a sense, a beautiful `neovim` is not really possible unless one uses complicated software that can render all those elements correctly. So why bother with terminal? Why not render directly as GUI? Well, there's an app for that too - [Neovide](https://neovide.dev/).

And finally let's all thank Microsoft for their [LSP](https://microsoft.github.io/language-server-protocol/) and [DAP](https://microsoft.github.io/debug-adapter-protocol//) protocols used in `Visual Studio Code` that made all these cool features in `neovim` possible. In a sense, modern `neovim` is only possible because `Visual Studio Code` is popular.

**Take that internet!**
