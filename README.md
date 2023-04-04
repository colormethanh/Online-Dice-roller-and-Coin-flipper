# Online Dice Roller and Coin Flipper
## Video URL: 

## How to run
1. cd into project
2. run $npm install
3. run $npm run dev 


## What is your project?
The online dice and coin roller is a application make with React and Three.js. The main purpose of the app is to practice React and learn three.js. The usage of the app is to provide and online platform to roll a dice and flip a coin that responds with realistic physics. It also will display on the screen the results of flip or roll. 

## Inspiration 
Prior to starting the project, I had watched a youtube video that featured many developer's portfolio and one in particularly stood out to me. Bruno Simon's portfolio was 50% game and 50% webpage, it used a 3D car to navigate the webpage where there were specific areas that would showcase his past works. His portfolio and the works that Bruno had done in the past transformed my understanding of what a "webpage" could be. With that, I decided that I wanted to learn the technology he used and thus solidified my decision to try and learn three.js.

## Trials and Tribulations
As with many programming projects I faced many problems along the way. Some technical and some mental. 

### technical Issue:
In terms of technical issues the biggest one I faced was managing the states of my project. The states were "empty", "select", "dice", and "coin". Each state dictates a plethora of things both in the realm of html/css as well as the three.js canvas. Such things include what is to be shown and what is to be hidden as well as how clicks and hovers should respond is all dictated by the "state". Accurately and effectivly orchestrating those responses required a lot and forced me to get quite intimate with my code (i.e, understanding it's ins and outs completely). Being forces to understand my code so intimatly helped me think about and understand my code so much more than I had before.      

### mindset struggles:
As a beginner I always question my skills and decisions. The sight of my project everytime I opened it filled me with a little bit of doubt. I would question how long everything is taking, how the end product will look, will I even be able to finish, etc. For about 80% of my time working on the project, it did not look promising. But, I just kept my head down and trusted the process and eventually it worked out in the end. I often said those words to myself "trust in the process" and as an independent programming student the *"process"* is much **bigger** than just this one project rather it's my journey as a whole and sometime it scares me...but other times, especially after finishing a project, it excites me!

## Project overview

My project is seperated into two main ***"components"*** the **Canvas** and the **Screen**. Although the screen component is nested inside of the the canvas (this was done due to state management) in my eyes they are two seperate entities. Connecting them is a a JS object I call *"canvasInit"* this file I consider the heart of my project because it manages most things three.js related as well as communicates to react what "state" the canvas is in which guides what the screen should show. 

### project/src/Canvas.jsx
>This file holds a component called **Canvas** where in which I initialized the object "canvasInit". The component returns both the three.js canvas as well as "screen" component. the component also passes a prop called "scene" to the **Screen** which gives the Screen component access to the three.js scene itself as well as any variables/functions it may contain.

### project/src/Screen.jsx
>This file holds a component called **Screen**. The component manages the html contents and what they do based on it's *"scene"* prop which was passed from the Canvas component. 

### project/src/lib/canvasInit.js
>This like I said above is the heart of the project. It's responsible for the initalization of the three.js scene, it's objects, and any functions related to the scene itself. The most important variable is it's **state** variable located in the constructor. This is read by **screen.jsx** in order to guide the html what to show.

### projects/src/lib/cubeInit.js
>This is code for constructing the 6 sided dice. 

### projects/src/screen.css
>Contains the majority of the css and keyframes for my project.

### Technologies used
> React, Three.js, Cannon-es, GSAP. 

## Citations/Credits
Thank you to [Ksenia Kondrashova](https://tympanus.net/codrops/2023/01/25/crafting-a-dice-roller-with-three-js-and-cannon-es/) for their amazing Tutorial on how to make a cube and working with 3D objects on the web! Without you this whole project wouldn't have been able to get started!

Thank you to [Grant Abbit](https://www.youtube.com/watch?v=r8ltW7pAN6M) for your wonderful tutorial on making a coin on blender! 
You and Ksenia helped open my eyes to the wonderful world of 3-D modeling and development. Though I may still be a noob at blender, just dipping my toes in may make me want to take the plunge in later in the future.

Thank you to [Piotr Galor](https://codepen.io/pgalor/pen/OeRWJQ) for your beautifully clean glitch animation!

Thank you to [Fabio Bergmann](https://codepen.io/fabiocberg/pen/wvqpXqg) for your awesome glitch effect button as well! Thanks to you and Piotr I've learned there are a million ways to create an effect.

Thank you to [dissimulate](https://codepen.io/dissimulate/pen/nmJyyg) for your text animation, it's the last thing I added to my project but it will be the first thing everyone seens when they visit the page!


## To the cs50 team
A giant thank you to the CS50 team! Your dedication to not just computer science but also to bettering the world through education and problems solving is an inspiration to us all and I hope to one day make as much on an impact on the world as you have for all us CS50 students.







