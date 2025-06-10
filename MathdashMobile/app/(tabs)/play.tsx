import { firestore } from "@/components/config"; // Your Firebase config
import { randomProblems } from "@/constants/randomProblem";
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    limit,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import uuid from "react-native-uuid";

const Play = () => {
  const [userId] = useState<string>(() => uuid.v4()); // Generate once and keep it
  const [matchId, setMatchId] = useState<string | null>(null);
  const [question, setQuestion] = useState<{ problem: string; answer: string; solution: string } | null>(null);
  const [answer, setAnswer] = useState<string>("");
  const [status, setStatus] = useState<"waiting" | "matched" | "done">("waiting");
  const [winner, setWinner] = useState<string | null>(null);
  const [opponentId, setOpponentId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Use refs to track cleanup
  const matchUnsubscribe = useRef<(() => void) | null>(null);
  const hasJoinedQueue = useRef<boolean>(false);

  // Cleanup function
  const cleanup = async () => {
    try {
      // Unsubscribe from match listener
      if (matchUnsubscribe.current) {
        matchUnsubscribe.current();
        matchUnsubscribe.current = null;
      }
      
      // Remove from queue if still there
      if (hasJoinedQueue.current) {
        await deleteDoc(doc(firestore, "queue", userId)).catch(() => {});
        hasJoinedQueue.current = false;
      }
    } catch (error) {
      console.error("Cleanup error:", error);
    }
  };

  // 1. Join queue and look for matches
  useEffect(() => {
    const joinQueueAndMatch = async () => {
      try {
        // Add self to queue
        const queueRef = collection(firestore, "queue");
        await setDoc(doc(queueRef, userId), { 
          userId, 
          timestamp: serverTimestamp() 
        });
        hasJoinedQueue.current = true;

        // Look for existing players in queue (excluding self)
        const qSnap = await getDocs(
          query(queueRef, orderBy("timestamp"), limit(10))
        );
        
        const availablePlayers = qSnap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(player => player.userId !== userId);

        if (availablePlayers.length > 0) {
          // Match with the first available player
          const opponent = availablePlayers[0];
          const newMatchId = uuid.v4();
          const matchRef = doc(firestore, "matches", newMatchId);
          const selectedQuestion = randomProblems[Math.floor(Math.random() * randomProblems.length)];

          await setDoc(matchRef, {
            players: [userId, opponent.userId],
            question: selectedQuestion,
            answers: {},
            winner: null,
            createdAt: serverTimestamp(),
          });

          // Remove both players from queue
          await Promise.all([
            deleteDoc(doc(firestore, "queue", userId)),
            deleteDoc(doc(firestore, "queue", opponent.userId))
          ]);
          
          hasJoinedQueue.current = false;
          setOpponentId(opponent.userId);
        }
      } catch (error) {
        console.error("Error joining queue:", error);
        Alert.alert("Error", "Failed to join game. Please try again.");
      }
    };

    joinQueueAndMatch();

    // Cleanup on unmount
    return cleanup;
  }, [userId]);

  // 2. Listen for match updates
  useEffect(() => {
    const setupMatchListener = () => {
      try {
        const matchQuery = query(
          collection(firestore, "matches"), 
          where("players", "array-contains", userId)
        );
        
        const unsubscribe = onSnapshot(matchQuery, (snapshot) => {
          snapshot.forEach(docSnap => {
            const data = docSnap.data();
            setMatchId(docSnap.id);
            setQuestion(data.question);
            
            // Find opponent ID
            const opponent = data.players.find((id: string) => id !== userId);
            if (opponent) setOpponentId(opponent);
            
            // Update status
            if (data.winner) {
              setStatus("done");
              setWinner(data.winner);
            } else {
              setStatus("matched");
            }
          });
        }, (error) => {
          console.error("Match listener error:", error);
        });

        matchUnsubscribe.current = unsubscribe;
      } catch (error) {
        console.error("Error setting up match listener:", error);
      }
    };

    setupMatchListener();

    return () => {
      if (matchUnsubscribe.current) {
        matchUnsubscribe.current();
      }
    };
  }, [userId]);

  // 3. Submit answer
  const handleSubmit = async () => {
    if (!matchId || !question || !answer.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const matchRef = doc(firestore, "matches", matchId);
      const matchSnap = await getDoc(matchRef);
      const match = matchSnap.data();
      
      if (!match) {
        throw new Error("Match not found");
      }

      const correct = match.question.answer.trim().toLowerCase() === answer.trim().toLowerCase();
      
      if (!correct) {
        Alert.alert("Incorrect", "That's not the right answer. Try again!");
        setIsSubmitting(false);
        return;
      }

      // Check if user already answered
      if (match.answers[userId]) {
        Alert.alert("Already Answered", "You've already submitted an answer for this question.");
        setIsSubmitting(false);
        return;
      }

      const updatedAnswers = {
        ...match.answers,
        [userId]: { 
          answer: answer.trim(), 
          timestamp: Date.now(),
          correct: true
        }
      };

      await updateDoc(matchRef, { answers: updatedAnswers });

      // Check if both players have answered
      const [p1, p2] = match.players;
      if (updatedAnswers[p1] && updatedAnswers[p2]) {
        // Determine winner based on who answered first
        const winnerId = updatedAnswers[p1].timestamp < updatedAnswers[p2].timestamp ? p1 : p2;
        await updateDoc(matchRef, { winner: winnerId });
      }

    } catch (error) {
      console.error("Error submitting answer:", error);
      Alert.alert("Error", "Failed to submit answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset game
  const resetGame = () => {
    setMatchId(null);
    setQuestion(null);
    setAnswer("");
    setStatus("waiting");
    setWinner(null);
    setOpponentId(null);
    setIsSubmitting(false);
    
    // Rejoin queue
    const rejoinQueue = async () => {
      try {
        const queueRef = collection(firestore, "queue");
        await setDoc(doc(queueRef, userId), { 
          userId, 
          timestamp: serverTimestamp() 
        });
        hasJoinedQueue.current = true;
      } catch (error) {
        console.error("Error rejoining queue:", error);
      }
    };
    
    rejoinQueue();
  };

  return (
    <View style={styles.container}>
      {status === "waiting" && (
        <View style={styles.centerContent}>
          <Text style={styles.text}>Waiting for opponent...</Text>
          <ActivityIndicator size="large" color="white" style={styles.loader} />
          <Text style={styles.subtext}>Looking for another player to challenge!</Text>
        </View>
      )}

      {status === "matched" && question && (
        <View style={styles.gameContent}>
          <Text style={styles.questionText}>{question.problem}</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your answer"
            placeholderTextColor="#ccc"
            value={answer}
            onChangeText={setAnswer}
            autoFocus={true}
            editable={!isSubmitting}
          />
          <Button 
            title={isSubmitting ? "Submitting..." : "Submit Answer"} 
            onPress={handleSubmit}
            disabled={!answer.trim() || isSubmitting}
          />
          {isSubmitting && (
            <ActivityIndicator size="small" color="white" style={styles.submitLoader} />
          )}
        </View>
      )}

      {status === "done" && (
        <View style={styles.centerContent}>
          <Text style={styles.resultText}>
            {winner === userId ? "🎉 You Win!" : "😞 You Lose!"}
          </Text>
          <Text style={styles.subtext}>Correct Answer: {question?.answer}</Text>
          {question?.solution && (
            <Text style={styles.solutionText}>{question.solution}</Text>
          )}
          <View style={styles.buttonContainer}>
            <Button title="Play Again" onPress={resetGame} />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 20,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gameContent: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  questionText: {
    color: "white",
    fontSize: 28,
    textAlign: "center",
    marginBottom: 30,
    fontWeight: "bold",
  },
  resultText: {
    color: "white",
    fontSize: 32,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  subtext: {
    color: "gray",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  solutionText: {
    color: "#ccc",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
    fontStyle: "italic",
  },
  input: {
    height: 50,
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 15,
    color: 'white',
    fontSize: 18,
  },
  loader: {
    marginVertical: 20,
  },
  submitLoader: {
    marginTop: 10,
  },
  buttonContainer: {
    marginTop: 30,
    width: 200,
  },
});

export default Play;