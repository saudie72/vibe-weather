import { Track, useVideoConfig } from "remotion";
import { OutroScene } from "./OutroScene";
import { StepScene } from "./StepScene";
import { TitleScene } from "./TitleScene";

// Steps follow the chapter order of the PeopleSoft ELM 9.2 PeopleBooks.
export const ElmSetupFlow: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <Track name="Scenes">
      <TitleScene
        name="Title"
        durationInFrames={4 * fps}
        kicker="PEOPLESOFT ELM 9.2 · UPDATE IMAGE 33"
        title="Setup flow"
        subtitle="Eight steps, in the order PeopleBooks documents them"
      />
      <StepScene
        name="Step 1: Defaults"
        from={4 * fps}
        durationInFrames={5.5 * fps}
        step={1}
        title="Define defaults"
        why="System-wide rules every later step inherits."
        items={[
          "Install Defaults: general, enrollment, more",
          "Passing, grading and attendance schemes",
          "Reason codes and auto-drop options",
        ]}
        chapter="Ch. 2, Defining Defaults"
      />
      <StepScene
        name="Step 2: Environments and groups"
        from={9.5 * fps}
        durationInFrames={5.5 * fps}
        step={2}
        title="Environments & learner groups"
        why="Decide who sees which learning, and who runs it."
        items={[
          "Create learning environments",
          "Learner groups from criteria or queries",
          "Admin access by environment",
        ]}
        chapter="Ch. 3, Defining Learning Environments and Learner Groups"
      />
      <StepScene
        name="Step 3: People and org data"
        from={15 * fps}
        durationInFrames={5.5 * fps}
        step={3}
        title="Bring in people & org data"
        why="Learners, managers and organizations come from HCM."
        items={[
          "Manage person and organization data",
          "ELM Full Sync Integration guided process",
          "Auto-enroll on HCM status and job changes",
        ]}
        chapter="Ch. 6–8 (optional financial and third-party integration: Ch. 4–5)"
      />
      <StepScene
        name="Step 4: Approvals"
        from={20.5 * fps}
        durationInFrames={5.5 * fps}
        step={4}
        title="Set up approvals"
        why="Enrollment requests route through the Approval Framework."
        items={[
          "Configure the Approval Framework for ELM",
          "Define approval paths and approvers",
          "Test an enrollment request end to end",
        ]}
        chapter="Ch. 9, Setting Up the Approval Framework"
      />
      <StepScene
        name="Step 5: Objectives and components"
        from={26 * fps}
        durationInFrames={5.5 * fps}
        step={5}
        title="Objectives & learning components"
        why="What learning achieves, and the pieces it is made of."
        items={[
          "Define the objectives learning satisfies",
          "Set up learning component types",
          "Sessions, web-based, tests, assignments",
        ]}
        chapter="Ch. 10–11, Objectives; Setup for Learning Components"
      />
      <StepScene
        name="Step 6: Resources and payments"
        from={31.5 * fps}
        durationInFrames={5.5 * fps}
        step={6}
        title="Learning resources & payments"
        why="The people, places and money that classes need."
        items={[
          "Facilities, rooms and equipment",
          "Instructors and vendors",
          "Payment methods",
        ]}
        chapter="Ch. 12–13, Learning Resources; Payment Methods"
      />
      <StepScene
        name="Step 7: Learning catalog"
        from={37 * fps}
        durationInFrames={5.5 * fps}
        step={7}
        title="Build the learning catalog"
        why="Programs and courses in the catalog, scheduled as classes."
        items={[
          "Structure: programs, courses, classes",
          "Create catalog items",
          "Schedule classes or use class templates",
        ]}
        chapter="Ch. 14–19, Catalog Structure through Class Templates"
      />
      <StepScene
        name="Step 8: Mandatory learning"
        from={42.5 * fps}
        durationInFrames={5.5 * fps}
        step={8}
        title="Mandatory & supplemental learning"
        why="Required training and learning recorded from outside ELM."
        items={[
          "Assign mandatory learning",
          "Track due dates and compliance",
          "Record supplemental learning",
        ]}
        chapter="Ch. 20–21, Mandatory Learning; Supplemental Learning"
      />
      <OutroScene
        name="Outro"
        from={48 * fps}
        durationInFrames={6 * fps}
        title="Configure in this order"
        source="Source: PeopleSoft ELM 9.2 PeopleBooks (Oracle). Confirm details against the PeopleBooks for your update image."
      />
    </Track>
  );
};
