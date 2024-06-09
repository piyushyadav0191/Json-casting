"use client";

import { ClipboardButton } from "@/styles/icons";
import { Input, Textarea } from "@nextui-org/react";
import { Dropdown } from "@nextui-org/react";
import React, { FormEvent } from "react";
import Markdown from "react-markdown";

const Playground = () => {
  const [selected, setSelected] = React.useState(new Set(["string"]));
  const [data, setData] = React.useState("");
  const [value, setValue] = React.useState("");
  const [ApiResponse, setApiResponse] = React.useState();
  const [loading, setLoading] = React.useState(false);

  const selectedValue = React.useMemo(
    () => Array.from(selected).join(", ").replaceAll("_", " "),
    [selected]
  );

  console.log(selectedValue);

  const markdown = ApiResponse
    ? `${JSON.stringify(ApiResponse)}`
    : `
    {
        "data": "my name is Piyush",
        "format": {
          "name": {
            "type": "string"
          }
        }
      }
    `;

  const HandleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const payload = {
      data: data,
      format: {
        [value]: {
          type: selectedValue,
        },
      },
    };

    try {

      setLoading(true);
      const response = await fetch("/api/json", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const resData = await response.json();
      setLoading(false);
      setApiResponse(resData);
      console.log(resData);
    } catch (error) {
      setLoading(false);
      alert(error);
      console.log(error);
    } finally{
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (ApiResponse) {
      navigator.clipboard.writeText(JSON.stringify(ApiResponse, null, 2))
        .then(() => alert("Copied to clipboard!"))
        .catch(err => alert("Failed to copy text"));
    } else {
      console.log("No response to copy")
    }
  };

  return (
    <>
    <div className="flex w-full gap-4 max-w-7xl mx-auto">
      <h1 className="flex text-center text-2xl mb-6">Playground</h1>
      <div className="w-full gap-9 md:w-1/2">
        <h1 className="text-xl font-semibold">Enter your fields</h1>
        <form onSubmit={HandleSubmit} className="flex flex-col gap-4">
          <Input
            // rows={5}
            value={data}
            onChange={(e) => setData(e.target.value)}
            label="Data"
            placeholder="Enter your Data"
            className="w-full"
            required
          />
          <div className="flex flex-col">
            <Input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              label="Value"
              placeholder="Enter your value"
              className="mb-4"
              required
            />
            <Dropdown>
              <Dropdown.Button
                flat
                color="secondary"
                css={{ tt: "capitalize", mb: "$4" }}
              >
                {selectedValue}
              </Dropdown.Button>
              <Dropdown.Menu
                aria-label="Select type"
                color="secondary"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={selected}
                // @ts-ignore
                onSelectionChange={setSelected}
              >
                <Dropdown.Item key="string">String</Dropdown.Item>
                <Dropdown.Item key="boolean">Boolean</Dropdown.Item>
                <Dropdown.Item key="number">Number</Dropdown.Item>
                <Dropdown.Item key="array">Array</Dropdown.Item>
                <Dropdown.Item key="object">Object</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <button type="submit" className="self-start px-8 py-2 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200">
            Submit
          </button>
        </form>
      </div>
      <div className="w-full md:w-1/2 relative">
        <h1 className="text-xl">Response:</h1>
        <button 
          onClick={handleCopy} 
          className="absolute top-2 right-2 transition duration-200"
        >
          <ClipboardButton />
        </button>
        <Markdown className="mt-10">

          {loading ? "please wait..." : markdown}
          </Markdown>
      </div>
    </div>
  </>
  
  );
};

export default Playground;