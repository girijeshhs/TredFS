export type MockAutomatedAction = {
  id: string;
  label: string;
  params: string[];
};

export const mockAutomatedActions: MockAutomatedAction[] = [
  {
    id: "send_email",
    label: "Send Email",
    params: ["to", "subject"],
  },
  {
    id: "generate_doc",
    label: "Generate Document",
    params: ["template", "recipient"],
  },
];

export const getMockAutomatedAction = (
  actionId: string
): MockAutomatedAction | undefined =>
  mockAutomatedActions.find((action) => action.id === actionId);
