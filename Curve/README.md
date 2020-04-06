# Curve
An application for schedule forecasting that follows [FISH architecture](https://github.com/behappyrightnow/DA-Tools).

## Get Started
Download the file [curve.html (in dist)](https://github.com/behappyrightnow/DA-Tools/blob/master/Curve/dist/curve.html) and open it in your browser. 

## What does this app do?
This application utilizes cutting-edge mathematics created by Dr. Tom Keelin ([metalog distributions](http://metalogdistributions.com/), [15-min intro to metalogs for the probability geek](https://www.youtube.com/watch?v=6NT7Y-IFfoQ&list=PL2wNjYYUmtqkmZQ_MmpHC1dGPC630Q85X&index=5)) to add up forecasts of different pieces of work. Each piece of work has three assessments on how long it takes to complete the work graded as low-medium-high. The assessments are done in a specific manner through carefully designed questions. These questions have been developed and tested over multiple decades by the [Decision Analysis community](http://decisionprofessionals.com) to address commonly known assessment biases from decision science research (like anchoring). The questions below are designed to be asked by a facilitator to the group of people involved in the work:
 * **Facilitator Question:** For this piece of work (or feature), what are some reasons to finish fast?
   * **Facilitator Action:** Document the reasoning 
 * **Facilitator Question:** Given the reasons you gave, how low is low? Give me a duration such that going any lower would make you fall off your chair in disbelief. This is the point at which you are wobbling.
   * **Facilitator Action:** If there are multiple people making the assessment, ask them to write it down to avoid groupthink, and then share the numbers with the facilitator. Take the **lowest** number in the group for this assessment.
 * **Facilitator Question:** For this piece of work (or feature), what are some reasons beyond your control that will make you take a lot longer to finish?
   * **Facilitator Action:** Document the reasoning 
 * **Facilitator Question:** Given the reasons you gave, how high is high? Give me a duration such that going any higher would make you fall off your chair in disbelief. This is the point at which you are wobbling.
   * **Facilitator Action:** If there are multiple people making the assessment, ask them to write it down to avoid groupthink, and then share the numbers with the facilitator. Take the **highest** number in the group for this assessment.
 * **Facilitator Question:** Now assess the duration where you are most uncomfortable -- the actual duration will be equally likely to be above or below this assessment.
   * **Facilitator Action:** You can take the average if there are multiple numbers are this point.
  
Technically, you want the following to be true about the assessments:
  * There should only be a 10% chance in your mind that the actual duration is below the LOW number
  * There should only be a 10% chance in your mind that the actual duration is above the HIGH number
  * There should be a 50-50 chance that the actual duration is below or above the MED number
  
Click the edit button to change the inputs of the demo example and see how the total forecast changes.

## Assumptions
Certain assumptions are mathematically necessary for this forecasting method. First, each work item is independent of the other. Second, all of the items are happening in sequence. If you have "n" parallel streams of work, you will want "n" copies of this page with the appropriate data for each stream. It is much easier for the human mind to deal with parallelism with organization structure than it is to incorporate parallelism into our simple model. The payoff for that modeling complexity just isn't there for the conversations this tool is designed for.

## What is CDF and PDF?
These are the most technical terms in this tool, and understanding them greatly uplevels any organization that deals with uncertainty. CDF stands for "Cumulative Distribution Function" and PDF stands for "Probability Distribution Function." They both do very different things, and one can be derived from the other. For our purposes, we need to know the following in order to use them correctly:
 1. **Interpreting CDF:** Probability can be read off directly from the CDF. Just look for the date you want, and read off probability on the vertical axis. The probability statement you can make from this graph is, "My probability for finishing before date X is Y%". A great use of the CDF graph is to find the 90% duration (which is also summarized in the table). When teams don't have visibility to such analytics, they might inadvertently make commitments to the 10% point instead of the 90% point. In other words, you are committing to a date that upon deeper reflection, you would assign a 90% chance of failure. By knowing clearly the 90% point, you are able to make commitments to which you would assign only a 10% chance of failure.
 
 ![Total Duration CDF Example][DurationExample]

[DurationExample]: https://github.com/behappyrightnow/DA-Tools/blob/master/Curve/img/ninetyPercentPoint.png "Total Duration CDF Example"
 
 2. **Interpreting PDF:** Intuition around probability is very hard to get from the CDF, and for this, you will want to use the PDF. The PDF shows you the shape of your belief. This is where long tails become visible. Mathematically, the area under the curve is a measure of probability. The total area under the curve always amounts to 1 (or 100%). By comparing the different pieces of work, you can immediately tell if there are some pieces of work that have a long tail of uncertainty, meaning, there is a small chance it can really slip away from under you.

![PDF Example][PDFExample]

[PDFExample]: https://github.com/behappyrightnow/DA-Tools/blob/master/Curve/img/pdfExample.png "PDF Example"
 
 
   

