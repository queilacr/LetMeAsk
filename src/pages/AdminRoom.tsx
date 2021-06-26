


import { useHistory, useParams } from 'react-router-dom'
//import { FormEvent, useState } from 'react';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';
//import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';


import '../styles/room.scss';

import logoImg from '../assets/logo.svg';
import deleteImg from '../assets/delete.svg';
import checkImg from '../assets/check.svg';
import answerImg from '../assets/answer.svg';
import { database } from '../services/firebase';
//import { database } from '../services/firebase';





type RoomParams = {
    id: string;
}

export function AdminRoom() {

    const history = useHistory();
    const params = useParams<RoomParams>();
    const roomId = params.id;

    //   const { user } = useAuth();
    const { title, questions } = useRoom(roomId);

    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date()
        })
        history.push('/');
    }

    async function hanleCheckQuestionAnswered(questionId: string) {

        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true,
        })
    }

    async function hanleHighlightQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true,
        })
    }

    async function hanleDeleteQuestion(questionId: string) {
        if (window.confirm('Tem certeza que deseja excluir esta pergunta?')) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }


    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId} />
                        <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length}  pergunta(s)</span>}
                </div>

                <div className="question-list">
                    {questions.map(question => {
                        return (
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                                isAnswered={question.isAnswered}
                                isHighlighted={question.isHighlighted}
                            >
                                {!question.isAnswered && (
                                    <>
                                        <button type="button" onClick={() => hanleCheckQuestionAnswered(question.id)}>
                                            <img src={checkImg} alt="Marcar pergunta como respondida" />
                                        </button>
                                        <button type="button" onClick={() => hanleHighlightQuestion(question.id)}>
                                            <img src={answerImg} alt="Dar destaque a pergunta" />
                                        </button>
                                    </>
                                )}

                                <button type="button" onClick={() => hanleDeleteQuestion(question.id)}>
                                    <img src={deleteImg} alt="Remover pergunta" />
                                </button>
                            </Question>
                        );
                    })}
                </div>
            </main>

        </div>
    );
}