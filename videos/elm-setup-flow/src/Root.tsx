import { Composition, Folder } from "remotion";
import { ElmSetupFlow } from "./ElmSetupFlow";
import { OutroScene } from "./OutroScene";
import { StepScene } from "./StepScene";
import { TitleScene } from "./TitleScene";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ElmSetupFlow"
        component={ElmSetupFlow}
        durationInFrames={1620}
        fps={30}
        width={1920}
        height={1080}
      />
      <Folder name="Scenes">
        <Composition
          id="Title"
          component={TitleScene}
          durationInFrames={120}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            kicker: "PEOPLESOFT ELM 9.2 · UPDATE IMAGE 33",
            title: "Setup flow",
            subtitle: "Eight steps, in the order PeopleBooks documents them",
          }}
        />
        <Composition
          id="Step"
          component={StepScene}
          durationInFrames={165}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            step: 1,
            title: "Define defaults",
            why: "System-wide rules every later step inherits.",
            items: [
              "Install Defaults: general, enrollment, more",
              "Passing, grading and attendance schemes",
              "Reason codes and auto-drop options",
            ],
            chapter: "Ch. 2, Defining Defaults",
          }}
        />
        <Composition
          id="Outro"
          component={OutroScene}
          durationInFrames={180}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            title: "Configure in this order",
            source: "Source: PeopleSoft ELM 9.2 PeopleBooks (Oracle).",
          }}
        />
      </Folder>
    </>
  );
};
