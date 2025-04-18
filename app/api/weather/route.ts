import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query") || "London"
  const days = searchParams.get("days") || "3"

  try {
    const apiKey = process.env.WEATHERAPI_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "Weather API key is not configured" }, { status: 500 })
    }

    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${query}&days=${days}&aqi=yes&alerts=yes`,
      {
        next: {
          revalidate: 600, // Increase cache time to 10 minutes for better performance
        },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: errorData.error?.message || "Failed to fetch weather data" },
        { status: response.status },
      )
    }

    const data = await response.json()

    // Set cache headers for better client-side caching
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300",
        "CDN-Cache-Control": "public, max-age=600",
      },
    })
  } catch (error) {
    console.error("Weather API error:", error)
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 })
  }
}
