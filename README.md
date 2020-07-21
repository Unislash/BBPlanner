# What is this?
This is a personal project that I built for the community of a game I have enjoyed over the years called Battle Brothers. The game is a turn-based tactics strategy game set in the middle-ages, full of cutthroat mercenaries (of which you are one), noble houses, and magical beasts.

This tool itself lets you plan out builds for new recruits to your company of mercenaries, featuring both a perk picker and a stat forecaster.

# Inspiration
Parts of this tool are very heavily influenced by a previous tool, [Battle Brothers Perk Calculator](http://tumult.cc/bb-calc.html), which I used for many years. Eventually I grabbed the source for it, added some features for my own personal usage, and reached out to the author and sent along my modifications. He thanked me, but ultimately never ended up incorporating it.

So, eventually I decided to write it from scratch, using modern web technologies. As I built it, I started to get a few ideas of what I could add to the tool. So far I've added:
1. Revamped Perk Planner, with animations and better accessibility
1. A "Remaining Perks" counter, which works with student
1. The ability to name your build!
1. A list of builds that you've made, letting you navigate from within a single tab
1. The ability to save a build to your local storage (complete with auto-updating whenever changes are made)
1. The URL is shareable just like the tumult tool, but it uses base64 compression to keep the url as short as possible
1. A Stat Forecaster, which estimates the max stats a character would have at level 11
1. Links to other community resources

# A note to code spelunkers
This is a personal project. I definitely took a few shortcuts, but I felt like the code complexity was going to stay pretty small. Eventually I regretted taking those shortcuts, but hey, it's just a fun project.

If I were to approach this from a professional perspective, I would have done the following:
* Consistently routed all my actions through redux/thunks--even the local storage synchronization methods
* Refactored the local storage and url creation methods to tidy them up after a lot of organic growth
* Kept my leaf react components much more separated from business logic, and instead only focused on rendering
* My goodness why didn't I use sass or css-in-js from the start?
* Written tests!