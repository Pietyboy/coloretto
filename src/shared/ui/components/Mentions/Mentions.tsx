import type { ComponentPropsWithoutRef, ElementRef } from 'react';
import { forwardRef } from 'react';

import { Mentions as AntMentions } from 'antd';

export type MentionsProps = ComponentPropsWithoutRef<typeof AntMentions>;
type MentionsRef = ElementRef<typeof AntMentions>;

const BaseMentions = forwardRef<MentionsRef, MentionsProps>((props, ref) => <AntMentions ref={ref} {...props} />);

BaseMentions.displayName = 'Mentions';

export const Mentions = Object.assign(BaseMentions, {
  Option: AntMentions.Option,
});
