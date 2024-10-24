
import { useEffect, useState } from "react";
import { Participant, User } from "@/types";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useLoaderData } from "react-router-dom";

type Props = {
    totalAmount: number;
    splitMethod: string;
};

export default function ParticipantList({ totalAmount, splitMethod }: Props) {
    const user =  useLoaderData() as User
    const [participants, setParticipants] = useState<Participant[]>([
        { name: user.name, percent: 0, contribution: 0 },
    ]);

    const [error, setError] = useState<string>("");
    const [newParticipant, setNewParticipant] = useState<Participant>({
        name: "",
        contribution: 0,
    });

    const updateExact = (participants: Participant[], addNew: boolean = true) => {
        const updated = [...participants]
        if (!addNew) {
            updated[0].contribution = totalAmount
            setParticipants(updated)
            return
        }

        updated.push({ ...newParticipant })
        if (newParticipant.contribution > updated[0].contribution) {
            setError("Total amount exceeded")
            return
        }
        updated[0].contribution -= newParticipant.contribution
        return updated
    }

    const updateEqual = (participants: Participant[], addNew: boolean = true) => {
        const updated = [...participants]
        if (addNew) updated.push({ ...newParticipant })

        const share = Math.floor(totalAmount / updated.length)
        const roundError = totalAmount - (share * updated.length)

        updated.forEach((p, i) => {
            p.contribution = share
            if (i == 0) p.contribution += roundError
        })
        return updated
    }

    const updatePercent = (participants: Participant[], addNew: boolean = true) => {
        const updated = [...participants]
        if (addNew) {
            updated.push({ ...newParticipant })

            const totalPercent = updated.reduce((a, b) => a + (b.percent || 0), 0)
            if (totalPercent > 100) {
                setError("Total percent can't exceed 100")
                return
            }
        }

        let sum = 0;
        updated.forEach((p, i) => {
            if (i == 0) {
                p.contribution = 0;
                return
            }
            const share = totalAmount * p.percent! / 100
            p.contribution = share
            sum += share
        })

        const userContribution = totalAmount - sum
        updated[0].contribution = userContribution
        return updated
    }

    const update = (participants: Participant[], addNew: boolean = true) => {
        let updated;
        if (splitMethod === "exact") updated = updateExact(participants, addNew);
        else if (splitMethod === "equal") updated = updateEqual(participants, addNew);
        else if (splitMethod === "percent") updated = updatePercent(participants, addNew)

        if (typeof updated !== "undefined") setParticipants(updated)
    }

    const onChangeNPName = (e: React.ChangeEvent<HTMLInputElement>) =>
        setNewParticipant((state) => ({ ...state, name: e.target.value }));

    const onChangeNPContribution = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewParticipant((state) => ({ ...state, contribution: parseInt(e.target.value) }));
    };

    const onChangeNPPercent = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewParticipant((state) => ({ ...state, percent: parseInt(e.target.value) }));
    };

    const handleAddParticipant = () => {
        setError("")
        if (newParticipant.name.length == 0) return;
        if (splitMethod === "exact" && newParticipant.contribution == 0) return
        if (splitMethod === "percent" && newParticipant.percent == 0) return

        if (participants.filter(p => p.name === newParticipant.name).length != 0) {
            setError("Participant already added")
            return
        }

        update(participants)
    };

    const handleRemoveParticpant = (index: number) => {
        if (index == 0) return; // Prevent removing the user

        const updatedParticipants = participants.filter((_, i) => i != index);

        update(updatedParticipants, false)
    };

    useEffect(() => {
        setNewParticipant({ name: "", contribution: 0, percent: undefined })
        setParticipants([{ name: user.name, percent: 0, contribution: totalAmount }])
    }, [splitMethod])

    useEffect(() => {
        // Ensure the user's contribution is updated when totalAmount changes

        update(participants, false)

    }, [totalAmount]);

    return (
        <>
            {/* this will be submitted with the form */}
            <Input readOnly className="sr-only" name="participants" value={JSON.stringify(participants)} />
            <div className="w-full my-2 flex items-center justify-between">
                <div className="flex gap-1 items-center">
                    <h3 className="text-md">Participants</h3>
                    <p className="text-xs text-red-300">(Click to delete an entry)</p>
                </div>

            </div>
            <div className="flex flex-col gap-2 max-h-32 overflow-y-auto">
                {participants.map((p, i) => {
                    const hoverClassName = i === 0 ? "" : "hover:bg-destructive hover:text-destructive-foreground";
                    return (
                        <div
                            onClick={() => handleRemoveParticpant(i)}
                            className={`cursor-pointer rounded-md flex justify-between p-2 ${hoverClassName}`}
                            key={`${user._id}-${i}`}
                        >
                            <p>{p.name}</p>
                            <p>Rs. {p.contribution}</p>
                        </div>
                    );
                })}
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex gap-4">
                    <Input list="participants-list" onChange={onChangeNPName} value={newParticipant.name} placeholder="Name" />
                    <datalist id="participants-list">
                        {user.friends.map((f, i) => <option key={`poption-${i}`} value={f} />)}
                    </datalist>
                    {splitMethod === "exact" && <Input
                        onChange={onChangeNPContribution}
                        value={newParticipant.contribution == 0 ? "" : newParticipant.contribution}
                        type="number"
                        placeholder="Contribution in (Rs)"
                    />}
                    {splitMethod === "percent" && <Input
                        onChange={onChangeNPPercent}
                        value={newParticipant.percent || ""}
                        type="number"
                        placeholder="Percent (%)"
                    />}
                </div>
                <Button type="button" onClick={handleAddParticipant} variant="outline">
                    Add Participant
                </Button>
            </div>
            <p className="text-red-400 brightness-110 text-md">{error}</p>
        </>
    );
}

