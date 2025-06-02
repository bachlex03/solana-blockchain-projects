"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Trash2, Plus } from "lucide-react";

import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import "@solana/wallet-adapter-react-ui/styles.css";
import dynamic from "next/dynamic";

// Dynamically import WalletMultiButton and WalletDisconnectButton with SSR disabled
const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

const WalletDisconnectButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletDisconnectButton
    ),
  { ssr: false }
);

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const dummyTodos: Todo[] = [
  { id: 1, text: "Learn React", completed: false },
  { id: 2, text: "Build a todo app", completed: false },
  { id: 3, text: "Deploy to production", completed: true },
];

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>(dummyTodos);
  const [newTodo, setNewTodo] = useState("");
  const wallet = useWallet();
  const anchorWallet = useAnchorWallet();
  const { connection } = useConnection();

  const addTodo = () => {
    if (newTodo.trim() !== "") {
      const todo: Todo = {
        id: Date.now(),
        text: newTodo.trim(),
        completed: false,
      };
      setTodos([...todos, todo]);
      setNewTodo("");
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const incompleteTodos = todos.filter((todo) => !todo.completed);
  const completeTodos = todos.filter((todo) => todo.completed);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  useEffect(() => {
    if (anchorWallet) {
      console.log("Anchor Wallet connected:");
    }
    if (wallet.connected) {
      setTodos([]);
    }
  }, [connection]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Todo App</h1>
          <p className="text-gray-600 mt-2">Organize your tasks efficiently</p>
          <div className="mt-4 flex justify-center gap-4">
            <WalletMultiButton />
            <WalletDisconnectButton />
          </div>
        </div>

        {/* Add Todo Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Task
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter a new task..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={addTodo} disabled={!newTodo.trim()}>
                Add Task
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Incomplete Tasks Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Incomplete Tasks</span>
                <span className="text-sm font-normal bg-red-100 text-red-800 px-2 py-1 rounded-full">
                  {incompleteTodos.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {incompleteTodos.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No incomplete tasks! 🎉
                  </p>
                ) : (
                  incompleteTodos.map((todo) => (
                    <div
                      key={todo.id}
                      className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
                    >
                      <Checkbox
                        id={`incomplete-${todo.id}`}
                        checked={todo.completed}
                        onCheckedChange={() => toggleTodo(todo.id)}
                      />
                      <label
                        htmlFor={`incomplete-${todo.id}`}
                        className="flex-1 text-gray-900 cursor-pointer"
                      >
                        {todo.text}
                      </label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTodo(todo.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Complete Tasks Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Complete Tasks</span>
                <span className="text-sm font-normal bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {completeTodos.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {completeTodos.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No completed tasks yet
                  </p>
                ) : (
                  completeTodos.map((todo) => (
                    <div
                      key={todo.id}
                      className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200 hover:shadow-sm transition-shadow"
                    >
                      <Checkbox
                        id={`complete-${todo.id}`}
                        checked={todo.completed}
                        onCheckedChange={() => toggleTodo(todo.id)}
                      />
                      <label
                        htmlFor={`complete-${todo.id}`}
                        className="flex-1 text-gray-700 line-through cursor-pointer"
                      >
                        {todo.text}
                      </label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTodo(todo.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-gray-600">
              <p>
                Total: <span className="font-semibold">{todos.length}</span>{" "}
                tasks | Incomplete:{" "}
                <span className="font-semibold text-red-600">
                  {incompleteTodos.length}
                </span>{" "}
                | Complete:{" "}
                <span className="font-semibold text-green-600">
                  {completeTodos.length}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
