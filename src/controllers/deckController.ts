import {
    TDeck,
    TDeckQuestion,
    TDeckResult,
    TDeckWithQuestions,
} from "../types/deckTypes";
import { Request, Response } from "express";

import * as deckServices from "../services/deckServices";
import * as userServices from "../services/userServices";
import { DeckResults, Decks } from "@prisma/client";

export async function insertDeck(req: Request, res: Response) {
    const userId: number = Number(res.locals.retornoJwtVerify.id);
    const deck: TDeck = req.body;

    await deckServices.validateNewDeckNameForUser(deck, userId);
    const createdDeck = await deckServices.insertDeck(deck, userId);

    res.status(201).send(createdDeck);
}

export async function insertQuestions(req: Request, res: Response) {
    const userId: number = Number(res.locals.retornoJwtVerify.id);
    const deckId: number = Number(req.params.deckId);
    const questions: TDeckQuestion[] = req.body.questions;

    await deckServices.validateDeckExists(deckId);
    await deckServices.validateDeckBelongsToUser(deckId, userId);
    await deckServices.insertQuestions(questions, deckId);
    const deck = await deckServices.getDeckWithQuestions(deckId);

    res.status(201).send(deck);
}

export async function getDeckById(req: Request, res: Response) {
    const deckId: number = Number(req.params.deckId);

    await deckServices.validateDeckExists(deckId);
    const deck = await deckServices.getDeckWithQuestions(deckId);

    res.status(200).send(deck);
}

export async function getDecksByUserId(req: Request, res: Response) {
    const userId: number = Number(req.params.userId);

    await userServices.validateUserExists(userId);
    const username: string | undefined = await userServices.getUsernameById(
        userId
    );
    const decks: Decks[] = await deckServices.getDecksByUserId(userId);

    res.status(200).send({ username, decks });
}

export async function insertDeckResult(req: Request, res: Response) {
    const userId: number = Number(res.locals.retornoJwtVerify.id);
    const deckId: number = Number(req.params.deckId);
    const deckResult: TDeckResult = req.body;

    await deckServices.validateDeckExists(deckId);
    await userServices.validateUserExists(userId);
    const createdDeckResult: DeckResults = await deckServices.insertDeckResult(
        deckResult,
        deckId,
        userId
    );

    res.status(201).send(createdDeckResult);
}

export async function getDeckResults(req: Request, res: Response) {
    const deckId: number = Number(req.params.deckId);

    await deckServices.validateDeckExists(deckId);
    const results = await deckServices.getDeckResults(deckId);

    res.status(200).send(results);
}

export async function deleteDeckById(req: Request, res: Response) {
    const userId: number = Number(res.locals.retornoJwtVerify.id);
    const deckId: number = Number(req.params.deckId);

    await deckServices.validateDeckExists(deckId);
    await deckServices.validateDeckBelongsToUser(deckId, userId);
    await deckServices.deleteDeckById(deckId);

    res.sendStatus(200);
}
