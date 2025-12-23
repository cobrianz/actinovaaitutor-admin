
import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    // Aggregate subscriber counts by plan
    const subscriberCounts = await db.collection("users").aggregate([
      { $match: { "subscription.status": "active" } },
      { $group: { _id: "$subscription.plan", count: { $sum: 1 } } }
    ]).toArray()

    const counts: Record<string, number> = {}
    subscriberCounts.forEach((doc: any) => {
      if (doc._id) counts[doc._id] = doc.count
    })

    const dbPlans = await db.collection("plans").find({}).toArray()

    const plans = dbPlans.map(plan => ({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      billing: plan.billing,
      features: plan.features,
      subscribers: counts[plan.name] || 0,
      status: plan.status,
      color: plan.color,
    }))

    return NextResponse.json({ plans })
  } catch (error) {
    console.error("Failed to fetch plans:", error)
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()

    const newPlan = {
      ...body,
      id: body.id || body.name.toLowerCase().replace(/\s+/g, '-'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    await db.collection("plans").insertOne(newPlan)

    return NextResponse.json({ message: "Plan created successfully", plan: newPlan })
  } catch (error) {
    console.error("Failed to create plan:", error)
    return NextResponse.json({ error: "Failed to create plan" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const body = await request.json()
    const { _id, ...updateData } = body

    if (!_id && !body.id) {
      return NextResponse.json({ error: "Plan ID is required" }, { status: 400 })
    }

    const query = _id ? { _id: new ObjectId(_id) } : { id: body.id }

    await db.collection("plans").updateOne(
      query,
      {
        $set: {
          ...updateData,
          updatedAt: new Date().toISOString()
        }
      }
    )

    return NextResponse.json({ message: "Plan updated successfully" })
  } catch (error) {
    console.error("Failed to update plan:", error)
    return NextResponse.json({ error: "Failed to update plan" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  return PUT(request)
}

export async function DELETE(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Plan ID is required" }, { status: 400 })
    }

    // Attempt to delete by custom 'id' first, then by ObjectId if that fails or matches invalid format
    let result = await db.collection("plans").deleteOne({ id: id })

    if (result.deletedCount === 0 && ObjectId.isValid(id)) {
      result = await db.collection("plans").deleteOne({ _id: new ObjectId(id) })
    }

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Plan deleted successfully" })
  } catch (error) {
    console.error("Failed to delete plan:", error)
    return NextResponse.json({ error: "Failed to delete plan" }, { status: 500 })
  }
}
