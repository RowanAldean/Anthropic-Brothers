# Buildsmart
[Buildsmart](https://buildsmart.vercel.app/) is a product developed as part of the first [Anthropic London Hackathon](https://anthropiclondon.devpost.com/). 

We feed all relevant council documents around planning permissions for construction projects into the large context window provided by Claude 2 (Anthropic's LLM), before orchestrating well designed prompts with LangChain to provide a user friendly experience via a Next.js application.

## What is Buildsmart?
[Buildsmart AI](https://buildsmart.vercel.app/) helps planning projects in 3 ways.
1) First it helps you determine if you even need planning permission via an integrated chat window that has parsed all relevant council documentation.
2) Then you get advice on putting together a strong planning permission application based on the councils context
3) Finally the AI looks at previous applications which have been rejected or approved and the notes attached to them, providing you with relevant links if you have a similar project.

Put simply it provides requirements, advice & guidance. 

## Important Notes
- The project was deployed on the Vercel free tier, which has a 10 second timeout for function calls. The existing implementation takes longer than this due to large context window and a lack of embeddings being used, this means it **only functions locally**.
- There are **no plans to maintain this project** for the foreseeable future. If this changes then this README will be updated.
