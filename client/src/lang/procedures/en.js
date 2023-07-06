const procedures = {
	eyelashLamination_botox_eyelashColoring: "Lash lamination, Botox (filler) and Eyelash tint (Lash secret / In Lei)",
	eyelashLaminationWithoutBotox_eyelashColoring: "Lamination of eyelashes without Botox (Lash secret / In Lei) and Eyelash color",
	eyelashLaminationWithoutBotoxAndWithoutEyelashColoring: "Lamination of eyelashes without Botox (filler) Lash secret",
	eyelashColoringWithPaint: "Coloring eyelashes with paint",
	modelingAndPaintingEyebrowsWithPaint: "Sculpting and painting eyebrows with Paint",
	modelingAndColoringEyebrowsWithHenna: "Eyebrow modeling and coloring with henna",
	eyebrowModelingWithoutColoring: "Eyebrow modeling without coloring",
	longTermEyebrowStyling_corrections_coloring_specialComposition: "Long term eyebrow styling, Corrections, Contour and Special Composition",
	longTermEyebrowStylingWithoutCorrectionAndWithoutColoring: "Long term eyebrow styling without correction and without coloring",
	botox: "Botox",
	laminationEyelashes_botox_modelingAndColoringEyebrowsWithHennaOrPaint: "Lamination eyelashes lash secret, Botox (In Lei + Filler) and Modeling and coloring eyebrows with henna or paint",
	laminationEyelashes_botox_longTermStylingEyebrowsWithColoringAndCorrection: "Lash secret eyelash lamination, Botox (In Lei + Filler) and Long term brow styling with coloring and correction",
	laminationEyelashesWithoutBotoxOrFillerWithoutColoring_longTermStylingEyebrowsWithoutColoringAndCorrection: "Lamination eyelashes Lash secret (In Lei) without botox or filler, without tinting, Long term brow styling without tinting and correction",
	eyelashLamination_botox_eyelashColoringDescription: `
		<p>The procedure is a combined cosmetic process that helps to give the eyelashes a more voluminous and expressive look.</p>
		<p>At the beginning of the procedure, the lashes are laminated, which involves the application of special products to the lashes to help smooth, moisturize and give them a glossy look. This allows the lashes to look thicker, longer and curled.</p>
		<p>Then Botox (filler) for eyelashes is applied, which contains nourishing and strengthening components. Botox helps to improve the condition of eyelashes, making them more flexible, healthy and lush.</p>
		<p>At the end of the treatment, the eyelashes are tinted with products such as Lash secret or In Lei to give them a more intense and rich color. This allows you to emphasize the eyelashes and make them more visible.</p>
		<p>As a result of the procedure "Lamination of eyelashes + Botox (filler) + coloring of eyelashes (Lash secret / In Lei)", eyelashes get a well-groomed and effective look, while their natural beauty and volume are enhanced.</p>
	`,
	eyelashLaminationWithoutBotoxAndWithoutEyelashColoringDescription: `
		<p>The procedure includes several steps to give the eyelashes a thicker, fuller and longer look.</p>
<ul>
    <li>
        <p>Preparation: Eyelashes are cleaned of make-up and impurities with a special eyelash makeup remover. Eyelashes
            can also be rinsed to remove residues.</p>
    </li>
    <li>
        <p>Filler application: The Lash secret filler, which contains nutrients and polymers, is applied to the
            eyelashes. This filler helps to increase the volume of the eyelashes, filling their structure and creating a
            lush effect.</p>
    </li>
    <li>
        <p>Fixation: Eyelashes are fixed with special patches or film to ensure maximum effect of the filler. The
            eyelashes are left under the film for a certain time so that the filler can penetrate the eyelashes.</p>
    </li>
    <li>
        <p>Tinting of eyelashes: After removing the film, the eyelashes can be tinted to give them a richer and more
            expressive color. This is done using special eyelash dyes.</p>
    </li>
    <li>
        <p>Finishing: After tinting, the lashes are rinsed again to remove any dye residue. The lashes can be tinted
            with a perfectly even color or with a gradient effect.</p>
    </li>
</ul>
<p>As a result of the "Lamination of eyelashes without Botox (filler) Lash secret" eyelashes become more lush,
    voluminous and long. The filler fills the voids in the structure of the eyelashes, making them thicker and giving
    the look more expressiveness. In addition, coloring the eyelashes enhances the effect and gives them a rich color.
</p>
	`,
	eyelashColoringWithPaintDescription: `
		<p>The eyelash tinting procedure is a process that results in a richer and more expressive color of the eyelashes.Here
    is a general overview of this procedure:</p>
<ul>
    <li>
        <p>Preparation: Eyelashes are cleaned of make-up and impurities with a special eyelash make-up remover. This is
            important to remove makeup residue and ensure better adhesion of the paint.</p>
    </li>
    <li>
        <p>Skin protection: To protect the skin around the eyes, a special protective cream or patches are usually used
            to prevent paint from getting on the delicate skin around the eyes.</p>
    </li>
    <li>
        <p>Colour selection: The stylist selects the appropriate lash tint based on the desired shade and type of
            lashes. Usually, special lash dyes are used that are safe to use around the eyes.</p>
    </li>
    <li>
        <p>Dye application: Using a small brush or brush, the color is applied to the eyelashes from root to tip. The
            master ensures that the color is evenly distributed and covers all the eyelashes.</p>
    </li>
    <li>
        <p>Influence of dye: The dye is left on the eyelashes for a certain time so that the color is well absorbed. The
            exposure time may vary depending on the type of dye and the desired intensity of the color.</p>
    </li>
    <li>
        <p>Color removal: After exposure to the color, it is removed from the eyelashes using wet cotton swabs or
            special paint removers. The master carefully removes the color without damaging the eyelashes.</p>
    </li>
    <li>
        <p>Finish: After removing the color, the lashes can be washed and applied with a balm or conditioner to give
            them shine and moisture.</p>
    </li>
</ul>
<p>Dyeing your lashes with paint makes them more visible, darker and more expressive. It can help improve the appearance
    of the eyes, enhance the shape and definition of the lashes, and make the eyes more expressive.</p>
	`,
	modelingAndPaintingEyebrowsWithPaintDescription: `
		<p>Eyebrow shaping and coloring is a procedure that helps to change the shape and color of the eyebrows in order to
    achieve the desired appearance. The procedure consists of several steps:</p>
<ul>
    <li>
        <p>Preparation: Before starting the procedure, the specialist conducts a consultation with the client in order
            to understand his preferences and expectations from eyebrow modeling and coloring. Then, an analysis of the
            shape of the face and eyebrows is carried out to determine the most appropriate shape and color of the
            eyebrows.</p>
    </li>
    <li>
        <p>Sculpting: The specialist uses various techniques to shape the eyebrows to the desired shape. This may
            include removing excess hair with tweezers, waxing or threading to create more defined eyebrow contours. You
            can also use cosmetic products to fill in gaps and create a certain shape. </p>
    </li>
    <li>
        <p>Tinting: After shaping the eyebrows, the specialist proceeds to dyeing. He chooses the dye that matches the
            hair color and skin type of the client in order to achieve a natural and harmonious look. The dye is applied
            to the eyebrows using a special brush or applicator and left for a certain time to achieve the desired color
            intensity. Then the paint is washed off and the result is evaluated.</p>
    </li>
    <li>
        <p>Finishing: After the tint, the specialist can apply special moisturizers or fixatives to the eyebrows to
            emphasize their shape and improve the long-term result. The client can also be given advice on how to care
            for the eyebrows after the procedure.</p>
    </li>
</ul>
<p>It is important to note that the procedure for modeling and painting eyebrows with paint should be performed by an
    experienced specialist in order to achieve the best results and avoid unwanted consequences.</p>
	`,
	modelingAndColoringEyebrowsWithHennaDescription: `
		<p>The procedure includes several steps aimed at shaping the eyebrows and giving them the desired shade using a natural
    product - henna.</p>
<ul>
    <li>
        <p>Preparation: First, the eyebrows are cleaned of makeup and excess oil or cream. For this, you can use a
            special cleansing gel or tonic.</p>
    </li>
    <li>
        <p>Modeling: Using a cosmetic pencil or a special eyebrow pencil, the specialist determines the desired shape of
            the eyebrows, taking into account the individual features of the face and the architecture of the eyebrows.
            This includes determining the beginning, arch and end of the eyebrows.</p>
    </li>
    <li>
        <p>Henna application: Henna is a natural plant substance that gives the eyebrows the desired shade and helps to
            improve their shape. The specialist applies henna to the eyebrows with a special brush or stick, carefully
            filling the gaps between the hairs. The henna is left on the eyebrows for a certain time to she was able to
            penetrate and color the hairs.</p>
    </li>
    <li>
        <p>Setting and drying: After applying henna to the eyebrows, it should dry and set. Drying time may vary
            depending on the specific product, but usually takes about 30 - 40 minutes.</p>
    </li>
    <li>
        <p>Henna removal: After the henna is completely dry, it can be removed by gently rinsing it off the eyebrows
            with a cotton pad or swab dipped in warm water. In this case, the use of strong detergents or rubbing should
            be avoided to maintain the color effect.</p>
    </li>
</ul>
<p>Henna Brow Shaping and Tinting results in neat and shaped brows with the desired tint, which may look fuller and more
    expressive. Henna usually stays on the brows for several weeks, so results can last for that long.</p> p>
	`,
	eyebrowModelingWithoutColoringDescription: `
		<p>The procedure includes steps aimed at shaping the desired shape of the eyebrows and accentuating their natural color,
    without the use of coloring agents. Here are the main steps of this procedure:</p>
<ul>
    <li>
        <p>Preparation: Eyebrows are cleaned of makeup and excess oil or cream using a cleansing gel or tonic.</p>
    </li>
    <li>
        <p>Consultation and shaping: The specialist consults with the client to understand their preferences and take
            into account the individual features of the face and eyebrows.Then the desired eyebrow shape that best suits
            the client is determined.</p>
    </li>
    <li>
        <p>Sculpting: Using a cosmetic pencil or a special eyebrow pencil, the specialist models the eyebrows, creating
            the perfect shape. This includes defining the beginning, arch and end of the eyebrows, as well as removing
            excess hair if necessary.</p>
    </li>
    <li>
        <p>Fixing the shape: To maintain the shape of the brows, the specialist can apply a brow gel or wax to help fix
            them and improve their durability.</p>
    </li>
    <li>
        <p>Final shaping: To complete the procedure, the specialist may use brow pomade or powder to give the brows a
            more defined and tidy look. It can also help hide uneven or sparse areas.</p>
    </li>
</ul>
<p>The result of the Tintless Eyebrow Shaping procedure is neat and shaped eyebrows that enhance the natural color and
    expression of the face. This procedure is ideal for those who want to improve the shape of their eyebrows, but do
    not want to change their color.</p>
	`,
	longTermEyebrowStyling_corrections_coloring_specialCompositionDescription: `
		<p>The procedure "Permanent Brow Styling + Correction + Cont. + Special Compound" includes several steps to create a
    beautiful and neat shape of the eyebrows.</p>
<ul>
    <li>
        <p>Correction: First, the eyebrows are corrected using various methods such as waxing or tweezing. This allows
            you to remove excess hair and give the eyebrows a certain shape that suits your preferences and facial
            structure.</p>
    </li>
    <li>
        <p>Tinting: The brows are then tinted with special dyes that are matched to your hair tone and skin tone.
            Coloring gives the eyebrows a more expressive look, makes them more saturated and helps to emphasize the
            eyes.</p>
    </li>
    <li>
        <p>Long-term styling: After correction and coloring, a special composition is applied to the eyebrows, which
            allows them to be shaped and styled for a long period of time. It can be a gel texture or special styling
            products that fix the eyebrows and help them stay in perfect shape throughout the day.</p>
    </li>
    <li>
        <p>Special formulation: Depending on the salon or stylist, a special formulation may be used to help strengthen
            and condition the brows. It can be a nourishing or strengthening product that promotes the growth and health
            of the eyebrows.</p>
    </li>
</ul>
<p>To sum up, the procedure "Long-term brow styling + Correction + tint + special composition" allows you to create the
    perfect shape of the eyebrows, give them a rich color, ensure long-term styling and improve their condition with the
    help of special products.</p>
	`,
	longTermEyebrowStylingWithoutCorrectionAndWithoutColoringDescription: `
		<p>The procedure is designed to create a long-lasting shape and styling of eyebrows, without changing their color or
    removing excess hair.Here is a general description of this procedure:</p>
<ul>
    <li>
        <p>Preparation: Before starting the procedure, the specialist cleans and frees the eyebrows from makeup and
            other products. This ensures good adhesion of the products used for styling.</p>
    </li>
    <li>
        <p>Shape Fix: The specialist applies a special compound or gel texture to the brows to create the desired shape.
            This product fixes the brows, helping them stay in position and keep their shape for a long time.</p>
    </li>
    <li>
        <p>Styling: Using special tools and brushes, the master lays each eyebrow hair in the desired position. This
            allows you to create a more accurate and well-groomed eyebrow.</p>
    </li>
    <li>
        <p>Product Fix: After styling, the professional applies a fixative product to the brows to fix their shape and
            ensure long-lasting styling. This product protects the brows from external influences and helps them stay in
            perfect shape throughout the day.</p>
    </li>
</ul>
<p>The procedure "Long-term styling of eyebrows without correction and without coloring" allows you to achieve a neat
    and stable styling of the eyebrows, while maintaining their natural color and shape.</p>
	`,
	botoxDescription: `
		<p>The Botox procedure is a cosmetic procedure that uses injections of botulinum toxin type A to reduce facial wrinkles
    and expression lines. Here is a general description of this procedure:</p>
<ul>
    <li>
        <p>Consultation: Before the procedure, the patient undergoes a consultation with a doctor - cosmetologist or
            plastic surgeon. During the consultation, the patient's expectations, areas that require correction, and
            recommendations for the procedure are discussed.</p>
    </li>
    <li>
        <p>Preparation: Before starting the procedure, the area to be treated is cleaned and a local anesthetic may be
            applied for patient comfort.</p>
    </li>
    <li>
        <p>Botox injections: The doctor injects type A botulinum toxin into specific areas on the face where mimic
            wrinkles or lines are found. Botulinum toxin temporarily blocks muscle activity, reducing their contraction,
            which leads to smoothing wrinkles and improving the appearance of the skin.</p>
    </li>
    <li>
        <p>Botox injections: The doctor injects type A botulinum toxin into specific areas on the face where mimic
            wrinkles or lines are found. Botulinum toxin temporarily blocks muscle activity, reducing their contraction,
            which leads to smoothing wrinkles and improving the appearance of the skin.</p>
    </li>
</ul>
<p>Results from the Botox treatment may become visible after a few days, and the final result is achieved in about 1 - 2
    weeks. The effect usually lasts about 3 - 6 months, after which a second procedure may be required to maintain the
    results. It is important to remember that The Botox procedure should be carried out by a qualified doctor in order
    to minimize the risks and achieve the best results.</p>
	`,
	laminationEyelashes_botox_modelingAndColoringEyebrowsWithHennaOrPaintDescription: `
		<p>The Lash Secret Lamination + Botox (In Lei + Filler) + Eyebrow Shaping and Tinting with Henna or Paint procedure
    combines several methods to improve the appearance of eyelashes and eyebrows. Here is a general description of this
    procedure:</p>
<ul>
    <li>
        <p>Lash Secret Lamination: This procedure includes the use of special products to lift, strengthen and add
            volume to the eyelashes. First, the lashes are cleaned and prepared for application. Then, with the help of
            special gels or laminating agents, the eyelashes are lifted, strengthened and modeled for a more expressive
            look.</p>
    </li>
    <li>
        <p>Botox (In Lei + Filler) for eyelashes: This stage uses special products based on botulinum toxin (Botox) and
            filler to strengthen and nourish eyelashes. These products help to soften and strengthen eyelashes, making
            them more flexible and healthy.</p>
    </li>
    <li>
        <p>Eyebrow shaping and coloring with henna or paint: Eyebrow modeling is carried out, during which excess hairs
            are removed and the desired shape is created. The brows can then be dyed with henna (natural dye) or paint
            to give them a richer and more expressive color.</p>
    </li>
</ul>
<p>As a result of the procedure "Lamination of eyelashes Lash Secret + Botox (In Lei + Filler) + Modeling and coloring
    of eyebrows with henna or paint", an improvement in the appearance of eyelashes and eyebrows is achieved. Eyelashes
    become lifted, strengthened and acquire volume, and eyebrows get a more accurate shape and rich color. The procedure
    is carried out by an experienced specialist in order to achieve the best results.</p>
	`,
	laminationEyelashes_botox_longTermStylingEyebrowsWithColoringAndCorrectionDescription: `
		<p>The procedure combines several methods to improve the appearance of eyelashes and eyebrows. Here is a general
    description of this procedure:</p>
<ul>
    <li>
        <p>Lash Secret Laminating: This part of the treatment uses special products to lift and strengthen the lashes.
            The lashes are cleaned and prepared for application. The lashes are then lifted, strengthened and modeled
            with the help of laminating products, giving them volume and definition.</p>
    </li>
    <li>
        <p>Botox(In Lei + Filler) for eyelashes: This step uses special products based on botulinum toxin(Botox) and
            filler to strengthen and nourish the eyelashes. These products help to soften and strengthen the eyelashes,
            making them more flexible and healthy.</p> p>
    </li>
    <li>
        <p>Long-term eyebrow styling with coloring and correction: In this part of the procedure, the specialist carries
            out the correction of the shape of the eyebrows, removing excess hair and creating the desired shape. Then a
            special composition is applied to the eyebrows, which allows them to remain in perfect styling for a long
            period of time.If necessary eyebrows can be tinted to give them a rich color.</p>
    </li>
</ul>
<p>As a result of the Lash Secret Lamination + Botox (In Lei + Filler) + Permanent Eyebrow Styling with Coloring and
    Correction procedure, the eyelashes become lifted, strengthened and gain volume, and the eyebrows acquire a neat
    shape and rich color. The procedure is performed by a qualified specialist for best results.</p>
	`,
	laminationEyelashesWithoutBotoxOrFillerWithoutColoring_longTermStylingEyebrowsWithoutColoringAndCorrectionDescription: `
		<p>The procedure "Lash Secret Lamination (In Lei) without Botox or Filler, without coloring + Long-term eyebrow styling
    without coloring and correction" is designed to improve the appearance of eyelashes and eyebrows without the use of
    botulinum toxin, filler or coloring. Here is a general description of this procedure:</p>
<ul>
    <li>
        <p>Lash Secret Lamination (In Lei) without Botox or Filler, without staining: In this part of the procedure,
            special products are used to lift and strengthen the eyelashes. Eyelashes are cleaned and prepared for
            application. Then, with the help of laminating agents, the eyelashes are lifted, strengthened and modeled,
            giving them volume and expressiveness. In this case, the procedure does not include the use of Botox or
            Filler.</p>
    </li>
    <li>
        <p>Permanent brow styling without coloring and correction: In this part of the procedure, the specialist
            arranges each eyebrow hair in the desired position using a special composition or gel. This product fixes
            the eyebrows, helping them to stay in shape for a long time. In this case, the procedure does not include
            coloring or eyebrow correction.</p>
    </li>
</ul>
<p>The procedure "Lash Secret Lamination (In Lei) without Botox or Filler, without coloring + Long-term styling of
    eyebrows without coloring and correction" allows you to achieve more lifted, strengthened eyelashes with volume, as
    well as neatly styled eyebrows. The procedure is carried out by a specialist in order to achieve the best results
    without the use of additional components.</p>
	`,
};

export default procedures;