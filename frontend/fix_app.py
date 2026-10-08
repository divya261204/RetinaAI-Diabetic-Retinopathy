p = "src/App.jsx"

lines = open(p, encoding="utf-8").readlines()

insert = [
    '  const analyzeImage = async () => {\n',
    '    if (!selectedFile) {\n',
    '      alert("Please select a retinal image first.");\n',
    '      return;\n',
    '    }\n',
    '\n',
    '    setIsAnalyzing(true);\n',
    '    setPredictionResult(null);\n',
    '\n',
    '    try {\n',
    '      const formData = new FormData();\n',
    '      formData.append("file", selectedFile);\n',
    '\n',
    '      const response = await fetch("http://127.0.0.1:8000/api/predict", {\n',
    '        method: "POST",\n',
    '        body: formData,\n',
    '      });\n',
    '\n',
    '      const data = await response.json();\n',
    '\n',
    '      if (!response.ok || !data.success) {\n',
    '        throw new Error(data.error || "Prediction failed.");\n',
    '      }\n',
    '\n',
    '      setPredictionResult(data);\n',
    '    } catch (error) {\n',
    '      console.error("Prediction error:", error);\n',
    '      alert("Unable to analyze the image. Please check that the FastAPI server is running.");\n',
    '    } finally {\n',
    '      setIsAnalyzing(false);\n',
    '    }\n',
    '  };\n',
    '\n',
]

index = next(
    i for i, line in enumerate(lines)
    if "const [isAnalyzing, setIsAnalyzing]" in line
) + 1

lines[index:index] = insert

open(p, "w", encoding="utf-8").writelines(lines)

print("analyzeImage added successfully.")